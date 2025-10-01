module.exports = {
  apps: [
    {
      name: 'intransparency-frontend',
      script: './frontend/node_modules/.bin/next',
      args: 'start',
      cwd: '/app/frontend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.FRONTEND_PORT || 3000,
        NEXT_TELEMETRY_DISABLED: '1'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.FRONTEND_PORT || 3000,
        NEXT_TELEMETRY_DISABLED: '1'
      },
      // Performance optimizations
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',

      // Logging
      log_file: '/app/logs/frontend.log',
      out_file: '/app/logs/frontend-out.log',
      error_file: '/app/logs/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Health monitoring
      min_uptime: '10s',
      max_restarts: 5,

      // Graceful reload
      kill_timeout: 5000,
      listen_timeout: 8000,

      // Additional settings
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],

      // Environment specific settings
      env_file: '/app/.env'
    },
    {
      name: 'intransparency-api',
      script: './backend/api/server.js',
      cwd: '/app',
      instances: 2, // API typically needs fewer instances than frontend
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3001
      },

      // Performance optimizations
      max_memory_restart: '512M',
      node_args: '--max-old-space-size=512',

      // Logging
      log_file: '/app/logs/api.log',
      out_file: '/app/logs/api-out.log',
      error_file: '/app/logs/api-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,

      // Graceful reload
      kill_timeout: 5000,
      listen_timeout: 8000,

      // Additional settings
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],

      // Environment specific settings
      env_file: '/app/.env'
    },
    {
      name: 'intransparency-ai-service',
      script: 'python3',
      args: 'main.py',
      cwd: '/app/ai-service',
      instances: 1, // AI service typically runs single instance
      exec_mode: 'fork',
      interpreter: 'none', // Use system Python
      env: {
        PYTHONPATH: '/app/ai-service',
        FLASK_ENV: 'production',
        PORT: process.env.AI_SERVICE_PORT || 8000
      },
      env_production: {
        PYTHONPATH: '/app/ai-service',
        FLASK_ENV: 'production',
        PORT: process.env.AI_SERVICE_PORT || 8000
      },

      // Performance optimizations
      max_memory_restart: '2G',

      // Logging
      log_file: '/app/logs/ai-service.log',
      out_file: '/app/logs/ai-service-out.log',
      error_file: '/app/logs/ai-service-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Health monitoring
      min_uptime: '30s', // AI service takes longer to start
      max_restarts: 3,

      // Graceful reload
      kill_timeout: 10000, // Longer timeout for AI models

      // Additional settings
      autorestart: true,
      watch: false,

      // Environment specific settings
      env_file: '/app/.env'
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['production-server'],
      ref: 'origin/main',
      repo: 'git@github.com:your-org/intransparency.git',
      path: '/var/www/intransparency',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    },
    staging: {
      user: 'deploy',
      host: ['staging-server'],
      ref: 'origin/staging',
      repo: 'git@github.com:your-org/intransparency.git',
      path: '/var/www/intransparency-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging'
      }
    }
  }
}