#!/usr/bin/env python3
"""
Cache Manager for AI Service
Manages caching for expensive AI operations
"""

import asyncio
import logging
import json
import hashlib
from typing import Dict, List, Optional, Any, Union
import redis
import os
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class CacheManager:
    def __init__(self):
        self.redis_client = None
        self.memory_cache = {}
        self.max_memory_size = 1000  # Maximum items in memory cache
        
        # Initialize Redis connection
        self._init_redis()
        
        # Cache TTL settings (in seconds)
        self.ttl_settings = {
            "project_analysis": 3600,      # 1 hour
            "skill_assessment": 1800,      # 30 minutes
            "story_generation": 3600,      # 1 hour
            "market_trends": 7200,         # 2 hours
            "job_matching": 1800,          # 30 minutes
            "resume_optimization": 1800,   # 30 minutes
            "default": 1800               # 30 minutes
        }

    def _init_redis(self):
        """Initialize Redis connection"""
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
            logger.info("Redis cache connected successfully")
        except Exception as e:
            logger.warning(f"Redis connection failed: {str(e)}. Using memory cache only.")
            self.redis_client = None

    def _generate_cache_key(self, operation: str, **kwargs) -> str:
        """Generate cache key from operation and parameters"""
        # Create deterministic key from parameters
        param_string = json.dumps(kwargs, sort_keys=True, default=str)
        param_hash = hashlib.md5(param_string.encode()).hexdigest()
        return f"ai_cache:{operation}:{param_hash}"

    async def get(self, operation: str, **kwargs) -> Optional[Any]:
        """Get cached result for operation"""
        cache_key = self._generate_cache_key(operation, **kwargs)
        
        # Try Redis first
        if self.redis_client:
            try:
                cached_data = self.redis_client.get(cache_key)
                if cached_data:
                    result = json.loads(cached_data)
                    logger.debug(f"Cache hit (Redis): {operation}")
                    return result
            except Exception as e:
                logger.error(f"Redis cache get failed: {str(e)}")
        
        # Try memory cache
        if cache_key in self.memory_cache:
            cache_entry = self.memory_cache[cache_key]
            if datetime.now() < cache_entry["expires_at"]:
                logger.debug(f"Cache hit (Memory): {operation}")
                return cache_entry["data"]
            else:
                # Remove expired entry
                del self.memory_cache[cache_key]
        
        logger.debug(f"Cache miss: {operation}")
        return None

    async def set(self, operation: str, result: Any, **kwargs) -> bool:
        """Cache result for operation"""
        cache_key = self._generate_cache_key(operation, **kwargs)
        ttl = self.ttl_settings.get(operation, self.ttl_settings["default"])
        
        try:
            # Cache in Redis
            if self.redis_client:
                try:
                    serialized_result = json.dumps(result, default=str)
                    self.redis_client.setex(cache_key, ttl, serialized_result)
                    logger.debug(f"Cached in Redis: {operation}")
                except Exception as e:
                    logger.error(f"Redis cache set failed: {str(e)}")
            
            # Cache in memory
            self._set_memory_cache(cache_key, result, ttl)
            logger.debug(f"Cached in memory: {operation}")
            
            return True
            
        except Exception as e:
            logger.error(f"Cache set failed for {operation}: {str(e)}")
            return False

    def _set_memory_cache(self, cache_key: str, result: Any, ttl: int):
        """Set item in memory cache with size management"""
        # Clean up if cache is too large
        if len(self.memory_cache) >= self.max_memory_size:
            self._cleanup_memory_cache()
        
        expires_at = datetime.now() + timedelta(seconds=ttl)
        self.memory_cache[cache_key] = {
            "data": result,
            "expires_at": expires_at,
            "created_at": datetime.now()
        }

    def _cleanup_memory_cache(self):
        """Clean up expired entries and oldest entries if needed"""
        now = datetime.now()
        
        # Remove expired entries
        expired_keys = [
            key for key, entry in self.memory_cache.items()
            if now >= entry["expires_at"]
        ]
        
        for key in expired_keys:
            del self.memory_cache[key]
        
        # If still too large, remove oldest entries
        if len(self.memory_cache) >= self.max_memory_size:
            sorted_entries = sorted(
                self.memory_cache.items(),
                key=lambda x: x[1]["created_at"]
            )
            
            # Remove oldest 20% of entries
            remove_count = len(sorted_entries) // 5
            for i in range(remove_count):
                key = sorted_entries[i][0]
                del self.memory_cache[key]

    async def invalidate(self, operation: str, **kwargs) -> bool:
        """Invalidate cached result for operation"""
        cache_key = self._generate_cache_key(operation, **kwargs)
        
        try:
            # Remove from Redis
            if self.redis_client:
                try:
                    self.redis_client.delete(cache_key)
                except Exception as e:
                    logger.error(f"Redis cache invalidation failed: {str(e)}")
            
            # Remove from memory cache
            if cache_key in self.memory_cache:
                del self.memory_cache[cache_key]
            
            logger.debug(f"Cache invalidated: {operation}")
            return True
            
        except Exception as e:
            logger.error(f"Cache invalidation failed for {operation}: {str(e)}")
            return False

    async def invalidate_pattern(self, pattern: str) -> int:
        """Invalidate all cached results matching pattern"""
        invalidated_count = 0
        
        try:
            # Invalidate from Redis
            if self.redis_client:
                try:
                    keys = self.redis_client.keys(f"ai_cache:{pattern}:*")
                    if keys:
                        self.redis_client.delete(*keys)
                        invalidated_count += len(keys)
                except Exception as e:
                    logger.error(f"Redis pattern invalidation failed: {str(e)}")
            
            # Invalidate from memory cache
            pattern_key = f"ai_cache:{pattern}:"
            memory_keys = [
                key for key in self.memory_cache.keys()
                if key.startswith(pattern_key)
            ]
            
            for key in memory_keys:
                del self.memory_cache[key]
                invalidated_count += 1
            
            logger.info(f"Invalidated {invalidated_count} cache entries for pattern: {pattern}")
            return invalidated_count
            
        except Exception as e:
            logger.error(f"Pattern invalidation failed for {pattern}: {str(e)}")
            return 0

    async def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        stats = {
            "memory_cache_size": len(self.memory_cache),
            "memory_cache_max": self.max_memory_size,
            "redis_connected": self.redis_client is not None
        }
        
        # Add Redis stats if available
        if self.redis_client:
            try:
                redis_info = self.redis_client.info('memory')
                stats.update({
                    "redis_memory_used": redis_info.get('used_memory_human', 'unknown'),
                    "redis_keys": self.redis_client.dbsize()
                })
            except Exception as e:
                logger.error(f"Failed to get Redis stats: {str(e)}")
                stats["redis_error"] = str(e)
        
        return stats

    async def warm_cache(self, operations: List[Dict[str, Any]]):
        """Warm cache with common operations"""
        logger.info(f"Warming cache with {len(operations)} operations")
        
        for operation_config in operations:
            operation = operation_config.get("operation")
            params = operation_config.get("params", {})
            
            # Check if already cached
            cached = await self.get(operation, **params)
            if cached is None:
                logger.info(f"Cache miss during warm-up: {operation}")
                # You would implement actual operation calls here
                # For now, just log that it needs to be warmed
        
        logger.info("Cache warm-up completed")

    def clear_all(self) -> bool:
        """Clear all cache (use with caution)"""
        try:
            # Clear Redis
            if self.redis_client:
                try:
                    keys = self.redis_client.keys("ai_cache:*")
                    if keys:
                        self.redis_client.delete(*keys)
                except Exception as e:
                    logger.error(f"Redis clear failed: {str(e)}")
            
            # Clear memory cache
            self.memory_cache.clear()
            
            logger.info("All caches cleared")
            return True
            
        except Exception as e:
            logger.error(f"Cache clear failed: {str(e)}")
            return False

    # Context manager support for cache operations
    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # Cleanup if needed
        pass

# Decorator for automatic caching
def cached(operation: str, ttl: Optional[int] = None):
    """Decorator to automatically cache function results"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Extract cache manager from self if available
            cache_manager = None
            if args and hasattr(args[0], 'cache_manager'):
                cache_manager = args[0].cache_manager
            else:
                # Create temporary cache manager
                cache_manager = CacheManager()
            
            # Check cache first
            cached_result = await cache_manager.get(operation, **kwargs)
            if cached_result is not None:
                return cached_result
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Cache result
            await cache_manager.set(operation, result, **kwargs)
            
            return result
            
        return wrapper
    return decorator