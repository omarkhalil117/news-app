const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const AppError = require('./utils/appError');
const authController = require('./controllers/authController');
const handleGlobalError = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const sourceRoutes = require('./routes/sourcesRoutes');

const app = express();
app.use(cors());

dotenv.config('.env');
app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

app.get('/', (req, res) => res.json({ message: 'ok' }));

app.post('/api/v1/login', authController.login);
app.post('/api/v1/register', authController.register);
app.post('/api/v1/logout', authController.logout);
app.post('/api/v1/refresh-token', authController.refreshToken);

app.use('/api/v1/users', authController.protect, userRoutes);
app.use('/api/v1/sources', authController.protect, sourceRoutes);

app.all('*', (req, res, next) => {
  next(new AppError('not found', 404));
});

app.use(handleGlobalError);

module.exports = app;
