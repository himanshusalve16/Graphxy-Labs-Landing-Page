const { db } = require('../../../db/clampbox/db');
const { sql } = require('drizzle-orm');
const logger = require('../utils/logger');

exports.checkHealth = async (req, res) => {
  const uptime = process.uptime();
  const nodeVersion = process.version;
  const memoryUsage = process.memoryUsage();
  
  let databaseStatus = 'disconnected';
  let redisStatus = 'not_configured'; // Will be connected in future Redis client configurations

  try {
    // Run lightweight test query to check DB availability
    await db.execute(sql`SELECT 1`);
    databaseStatus = 'connected';
  } catch (error) {
    logger.error('Database health check failed:', error);
    databaseStatus = 'error';
  }

  const isHealthy = databaseStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'Clampbox Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime)}s`,
    database: databaseStatus,
    redis: redisStatus,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
    },
    node: nodeVersion
  });
};
