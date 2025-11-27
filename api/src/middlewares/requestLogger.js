const { v4: uuidv4 } = require('uuid');
const { logger } = require('../config/logger');

/**
 * Middleware que registra logs estruturados de cada requisição HTTP.
 */
function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();
  const requestId = uuidv4();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  const baseInfo = {
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  };

  logger.info('request:start', baseInfo);

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    const status = res.statusCode;
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

    const finishInfo = {
      ...baseInfo,
      status,
      durationMs: Number(durationMs.toFixed(2)),
      contentLength: res.getHeader('content-length'),
      userId: req.user?.id ?? null,
    };

    logger.log({ level, message: 'request:finish', ...finishInfo });
  });

  next();
}

module.exports = { requestLogger };
