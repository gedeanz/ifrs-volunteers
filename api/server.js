require('dotenv').config();
const app = require('./src/app');
const { logger } = require('./src/config/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  logger.info('Servidor iniciado com sucesso', {
    context: 'server',
    port: PORT,
  });

  logger.info('Swagger disponível', {
    context: 'server',
    url: `http://localhost:${PORT}/api-docs`,
  });
});