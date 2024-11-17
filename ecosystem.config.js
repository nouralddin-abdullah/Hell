module.exports = {
    apps: [
      {
        name: 'bishell',
        script: 'npm',
        args: 'run preview',
        env: {
          PORT: 5173,
          NODE_ENV: 'production',
        },
        watch: false,
        instances: 1,
        autorestart: true,
      },
    ],
  }