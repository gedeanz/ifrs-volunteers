require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs\n`);
});