const express = require('express');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const graphRouter = require('./routes/graphRoutes');
const problemRouter = require('./routes/problemRoutes');
const solutionRouter = require('./routes/solutionRoutes');
const nodeRouter = require('./routes/nodeRoutes');
const edgeRouter = require('./routes/edgeRoutes');
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
    'Too many requests from this IP address, please try again in an hour.',
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
      'price',
    ],
  })
);

// Routes
app.use('/api/v1/graphs', graphRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/solutions', solutionRouter);
app.use('/api/v1/nodes', nodeRouter);
app.use('/api/v1/edges', edgeRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
