const { logger } = require('../config/logger');

/**
 * Middleware de tratamento centralizado de erros da aplicação.
 */
function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;

  const logPayload = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    status,
    userId: req.user?.id ?? null,
  };

  if (err.stack) {
    logPayload.stack = err.stack;
  }

  logger.error(err.message || 'Erro interno do servidor', logPayload);

  res.status(status).json({ error: err.message || 'Erro interno do servidor' });
}

module.exports = { errorHandler };
