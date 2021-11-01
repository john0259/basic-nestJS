export default () => ({
  nv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'Inspection',
  host: process.env.APP_HOST || '0.0.0.0',
  port: process.env.APP_PORT || 3000,
  logger: {
    directory: process.env.LOG_DIRECTORY || 'logs/',
    fileName: process.env.LOG_FILENAME,
    level: process.env.LOG_LEVEL || 'info',
  },
});
