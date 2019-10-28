const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controller/bookingController');
const viewRouter = require('./routes/viewRoutes');
//Starting the Express file
const app = express();
app.enable('trust proxy');

//Global MIDDELWARE
app.set('view engine', 'pug');
//Securing Http Request
app.use(helmet());

//Devlopment Loging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limiting request from the Same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.post(
  '/webhoot-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

//Body Parser reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data Sanitization againest NOSQL Queary Injection
app.use(mongoSanitize());

//Data Sanitization againest XSS
app.use(xss());

//Prevent Parameter Polution

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(cors());

app.options('*', cors());
//Serving static File
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(favicon(path.join(__dirname, 'public/img/favicon.png')));
// app.set(express.static(`${__dirname}/public`));

app.use(compression());

//Test Middelware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTE'S

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
