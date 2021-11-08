const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const graphRoutes = require('./routes/graphRoutes');
const problemRouter = require('./routes/problemRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const nodeRoutes = require('./routes/nodeRoutes');
const edgeRoutes = require('./routes/edgeRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES

// Security HTTP Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit Requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests from this IP address, please try again in an hour.'
});
app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization Against NoSQL Query Injection
app.use(mongoSanitize());

// Data Sanitization Against Cross Site Scripting Attacks
app.use(xss());

// Prevent Parameter Polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Admin Routes
app.use('/api/v1/graphs', graphRoutes.adminGraphRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/solutions', solutionRoutes.adminSolutionRouter);
app.use('/api/v1/nodes', nodeRoutes.adminNodeRouter);
app.use('/api/v1/edges', edgeRoutes.adminEdgeRouter);

// User Routes
app.use('/api/v1/me/graphs', graphRoutes.userGraphRouter);
app.use('/api/v1/me/solutions', solutionRoutes.userSolutionRouter);
app.use('/api/v1/me/nodes', nodeRoutes.userNodeRouter);
app.use('/api/v1/me/edges', edgeRoutes.userEdgeRouter);

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
