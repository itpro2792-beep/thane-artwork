module.exports = {
  apps: [
    {
      name: 'ann-website',
      script: './dist/server/entry.mjs',
      env: {
        PORT: 4321,
        HOST: '0.0.0.0',
        NODE_ENV: 'production'
      }
    }
  ]
};
