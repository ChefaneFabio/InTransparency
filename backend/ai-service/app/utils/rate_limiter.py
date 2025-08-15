#!/usr/bin/env python3
"""
Rate Limiter for AI Service
Implements rate limiting for API endpoints and AI operations
"""

import asyncio
import logging
import time
from typing import Dict, List, Optional, Any
import redis
import os
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class RateLimitType(Enum):
    PER_MINUTE = "per_minute"
    PER_HOUR = "per_hour"
    PER_DAY = "per_day"
    CONCURRENT = "concurrent"

@dataclass
class RateLimit:
    limit: int
    window: int  # seconds
    limit_type: RateLimitType

@dataclass
class RateLimitStatus:
    allowed: bool
    remaining: int
    reset_time: datetime
    retry_after: Optional[int] = None

class RateLimiter:
    def __init__(self):
        self.redis_client = None
        self.memory_store = {}
        
        # Initialize Redis connection
        self._init_redis()
        
        # Default rate limits
        self.default_limits = {
            # General API limits
            "default": RateLimit(100, 3600, RateLimitType.PER_HOUR),  # 100 per hour
            "analysis": RateLimit(20, 3600, RateLimitType.PER_HOUR),   # 20 analyses per hour
            "generation": RateLimit(10, 3600, RateLimitType.PER_HOUR), # 10 generations per hour
            
            # Specific operation limits
            "project_analysis": RateLimit(15, 3600, RateLimitType.PER_HOUR),
            "story_generation": RateLimit(8, 3600, RateLimitType.PER_HOUR),
            "candidate_matching": RateLimit(25, 3600, RateLimitType.PER_HOUR),
            "skill_assessment": RateLimit(12, 3600, RateLimitType.PER_HOUR),
            "resume_optimization": RateLimit(10, 3600, RateLimitType.PER_HOUR),
            "market_analysis": RateLimit(20, 3600, RateLimitType.PER_HOUR),
            
            # Burst limits (per minute)
            "burst": RateLimit(10, 60, RateLimitType.PER_MINUTE),
            
            # Concurrent operation limits
            "concurrent_analysis": RateLimit(3, 0, RateLimitType.CONCURRENT),
        }

    def _init_redis(self):
        """Initialize Redis connection for distributed rate limiting"""
        try:
            redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            self.redis_client = redis.from_url(
                redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            # Test connection
            self.redis_client.ping()
            logger.info("Redis rate limiter connected successfully")
        except Exception as e:
            logger.warning(f"Redis connection failed: {str(e)}. Using memory-based rate limiting.")
            self.redis_client = None

    async def check_limit(
        self,
        identifier: str,
        operation: str = "default",
        custom_limit: Optional[RateLimit] = None
    ) -> bool:
        """Check if request is within rate limits"""
        try:
            status = await self.get_limit_status(identifier, operation, custom_limit)
            return status.allowed
        except Exception as e:
            logger.error(f"Rate limit check failed: {str(e)}")
            # Default to allowing request if rate limiter fails
            return True

    async def get_limit_status(
        self,
        identifier: str,
        operation: str = "default",
        custom_limit: Optional[RateLimit] = None
    ) -> RateLimitStatus:
        """Get detailed rate limit status"""
        
        limit = custom_limit or self.default_limits.get(operation, self.default_limits["default"])
        
        if limit.limit_type == RateLimitType.CONCURRENT:
            return await self._check_concurrent_limit(identifier, operation, limit)
        else:
            return await self._check_time_window_limit(identifier, operation, limit)

    async def _check_time_window_limit(
        self,
        identifier: str,
        operation: str,
        limit: RateLimit
    ) -> RateLimitStatus:
        """Check time-window based rate limits"""
        
        current_time = int(time.time())
        window_start = current_time - limit.window
        key = f"rate_limit:{operation}:{identifier}"
        
        if self.redis_client:
            return await self._redis_time_window_check(key, limit, current_time, window_start)
        else:
            return await self._memory_time_window_check(key, limit, current_time, window_start)

    async def _redis_time_window_check(
        self,
        key: str,
        limit: RateLimit,
        current_time: int,
        window_start: int
    ) -> RateLimitStatus:
        """Redis-based time window rate limiting"""
        
        try:
            pipe = self.redis_client.pipeline()
            
            # Remove old entries
            pipe.zremrangebyscore(key, 0, window_start)
            
            # Count current entries
            pipe.zcard(key)
            
            # Add current request
            pipe.zadd(key, {str(current_time): current_time})
            
            # Set expiration
            pipe.expire(key, limit.window)
            
            results = pipe.execute()
            current_count = results[1]
            
            # Check if within limit
            allowed = current_count < limit.limit
            remaining = max(0, limit.limit - current_count - (1 if allowed else 0))
            
            if not allowed:
                # Remove the request we just added since it's not allowed
                self.redis_client.zrem(key, str(current_time))
            
            reset_time = datetime.fromtimestamp(current_time + limit.window)
            retry_after = limit.window if not allowed else None
            
            return RateLimitStatus(
                allowed=allowed,
                remaining=remaining,
                reset_time=reset_time,
                retry_after=retry_after
            )
            
        except Exception as e:
            logger.error(f"Redis rate limit check failed: {str(e)}")
            # Fallback to memory check
            return await self._memory_time_window_check(key, limit, current_time, window_start)

    async def _memory_time_window_check(
        self,
        key: str,
        limit: RateLimit,
        current_time: int,
        window_start: int
    ) -> RateLimitStatus:
        """Memory-based time window rate limiting"""
        
        if key not in self.memory_store:
            self.memory_store[key] = []
        
        timestamps = self.memory_store[key]
        
        # Remove old entries
        timestamps[:] = [ts for ts in timestamps if ts > window_start]
        
        # Check if within limit
        allowed = len(timestamps) < limit.limit
        remaining = max(0, limit.limit - len(timestamps) - (1 if allowed else 0))
        
        if allowed:
            timestamps.append(current_time)
        
        reset_time = datetime.fromtimestamp(current_time + limit.window)
        retry_after = limit.window if not allowed else None
        
        return RateLimitStatus(
            allowed=allowed,
            remaining=remaining,
            reset_time=reset_time,
            retry_after=retry_after
        )

    async def _check_concurrent_limit(
        self,
        identifier: str,
        operation: str,
        limit: RateLimit
    ) -> RateLimitStatus:
        """Check concurrent operation limits"""
        
        key = f"concurrent:{operation}:{identifier}"
        
        if self.redis_client:
            try:
                current_count = self.redis_client.get(key) or 0
                current_count = int(current_count)
                
                allowed = current_count < limit.limit
                remaining = max(0, limit.limit - current_count - (1 if allowed else 0))
                
                return RateLimitStatus(
                    allowed=allowed,
                    remaining=remaining,
                    reset_time=datetime.now(),
                    retry_after=None
                )
                
            except Exception as e:
                logger.error(f"Redis concurrent check failed: {str(e)}")
        
        # Memory fallback
        current_count = self.memory_store.get(key, 0)
        allowed = current_count < limit.limit
        remaining = max(0, limit.limit - current_count - (1 if allowed else 0))
        
        return RateLimitStatus(
            allowed=allowed,
            remaining=remaining,
            reset_time=datetime.now(),
            retry_after=None
        )

    async def acquire_concurrent_slot(self, identifier: str, operation: str) -> bool:
        """Acquire a slot for concurrent operations"""
        
        limit = self.default_limits.get(f"concurrent_{operation}", self.default_limits.get("concurrent_analysis"))
        key = f"concurrent:{operation}:{identifier}"
        
        if self.redis_client:
            try:
                current = self.redis_client.incr(key)
                if current > limit.limit:
                    self.redis_client.decr(key)
                    return False
                
                # Set expiration to prevent stuck counters
                self.redis_client.expire(key, 3600)  # 1 hour max
                return True
                
            except Exception as e:
                logger.error(f"Redis concurrent acquisition failed: {str(e)}")
        
        # Memory fallback
        current = self.memory_store.get(key, 0)
        if current >= limit.limit:
            return False
        
        self.memory_store[key] = current + 1
        return True

    async def release_concurrent_slot(self, identifier: str, operation: str):
        """Release a slot for concurrent operations"""
        
        key = f"concurrent:{operation}:{identifier}"
        
        if self.redis_client:
            try:
                current = self.redis_client.get(key)
                if current and int(current) > 0:
                    self.redis_client.decr(key)
            except Exception as e:
                logger.error(f"Redis concurrent release failed: {str(e)}")
        
        # Memory fallback
        if key in self.memory_store:
            self.memory_store[key] = max(0, self.memory_store[key] - 1)
            if self.memory_store[key] == 0:
                del self.memory_store[key]

    async def get_usage_stats(self, identifier: str) -> Dict[str, Any]:
        """Get usage statistics for an identifier"""
        
        stats = {}
        current_time = int(time.time())
        
        for operation, limit in self.default_limits.items():
            if limit.limit_type == RateLimitType.CONCURRENT:
                continue
                
            key = f"rate_limit:{operation}:{identifier}"
            window_start = current_time - limit.window
            
            if self.redis_client:
                try:
                    # Remove old entries and count current
                    pipe = self.redis_client.pipeline()
                    pipe.zremrangebyscore(key, 0, window_start)
                    pipe.zcard(key)
                    results = pipe.execute()
                    current_usage = results[1]
                except Exception as e:
                    logger.error(f"Redis stats failed: {str(e)}")
                    current_usage = 0
            else:
                timestamps = self.memory_store.get(key, [])
                current_usage = len([ts for ts in timestamps if ts > window_start])
            
            stats[operation] = {
                "used": current_usage,
                "limit": limit.limit,
                "remaining": max(0, limit.limit - current_usage),
                "window_seconds": limit.window,
                "percentage_used": (current_usage / limit.limit) * 100 if limit.limit > 0 else 0
            }
        
        return stats

    async def reset_limits(self, identifier: str, operation: Optional[str] = None):
        """Reset rate limits for an identifier"""
        
        if operation:
            keys = [f"rate_limit:{operation}:{identifier}"]
        else:
            # Reset all operations for this identifier
            keys = []
            for op in self.default_limits.keys():
                keys.append(f"rate_limit:{op}:{identifier}")
        
        if self.redis_client:
            try:
                if keys:
                    self.redis_client.delete(*keys)
                logger.info(f"Reset Redis limits for {identifier}, operation: {operation}")
            except Exception as e:
                logger.error(f"Redis reset failed: {str(e)}")
        
        # Reset memory store
        for key in keys:
            if key in self.memory_store:
                del self.memory_store[key]
        
        logger.info(f"Reset memory limits for {identifier}, operation: {operation}")

    def get_headers(self, status: RateLimitStatus, limit: RateLimit) -> Dict[str, str]:
        """Get HTTP headers for rate limiting"""
        
        headers = {
            "X-RateLimit-Limit": str(limit.limit),
            "X-RateLimit-Remaining": str(status.remaining),
            "X-RateLimit-Reset": str(int(status.reset_time.timestamp()))
        }
        
        if status.retry_after:
            headers["Retry-After"] = str(status.retry_after)
        
        return headers

    # Context manager for concurrent operations
    class ConcurrentLimitContext:
        def __init__(self, rate_limiter, identifier: str, operation: str):
            self.rate_limiter = rate_limiter
            self.identifier = identifier
            self.operation = operation
            self.acquired = False

        async def __aenter__(self):
            self.acquired = await self.rate_limiter.acquire_concurrent_slot(
                self.identifier, self.operation
            )
            if not self.acquired:
                raise Exception(f"Concurrent limit exceeded for {self.operation}")
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            if self.acquired:
                await self.rate_limiter.release_concurrent_slot(
                    self.identifier, self.operation
                )

    def concurrent_limit(self, identifier: str, operation: str):
        """Context manager for concurrent operations"""
        return self.ConcurrentLimitContext(self, identifier, operation)

# Decorator for automatic rate limiting
def rate_limited(operation: str, identifier_key: str = "api_key"):
    """Decorator to automatically apply rate limiting"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Extract rate limiter and identifier
            rate_limiter = None
            identifier = "unknown"
            
            if args and hasattr(args[0], 'rate_limiter'):
                rate_limiter = args[0].rate_limiter
                
            if identifier_key in kwargs:
                identifier = kwargs[identifier_key]
            elif args and hasattr(args[0], identifier_key):
                identifier = getattr(args[0], identifier_key)
            
            if not rate_limiter:
                rate_limiter = RateLimiter()
            
            # Check rate limit
            allowed = await rate_limiter.check_limit(identifier, operation)
            if not allowed:
                from fastapi import HTTPException
                raise HTTPException(status_code=429, detail="Rate limit exceeded")
            
            # Execute function
            return await func(*args, **kwargs)
            
        return wrapper
    return decorator