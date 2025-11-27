const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { requestLogger } = require('./middlewares/requestLogger');
const { errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

// rotas
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/volunteers', volunteerRoutes);
app.use('/dashboards', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/', registrationRoutes);

// swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// erro padrão
app.use(errorHandler);

module.exports = app;