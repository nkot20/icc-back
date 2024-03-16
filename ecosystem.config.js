module.exports = {
    apps: [{
        name: 'm4m_api',
        script: './bin/www',
        node_args: '-r dotenv/config',
        autorestart: true,
        watch: false,
        env: { NODE_ENV: 'development' },
        env_production: { NODE_ENV: 'production' },
    }],
};
  