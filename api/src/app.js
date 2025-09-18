const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// health-check
app.get('/ping', (req, res) => res.json({ message: 'pong' }));

// rotas
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/dashboards', dashboardRoutes);
app.use('/admin', adminRoutes);

// swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// erro padrão
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

module.exports = app;