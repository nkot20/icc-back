const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const util = require('util');
const cors = require('cors');
const os = require('os');
const cron = require('node-cron');
const formData = require('express-form-data');
const mongoClient = require('./ClientMongo/MongoClientTransaction');
const indexRouter = require('./routes/index')

const { errorHandler, asyncErrorHandler, notFoundHandler } = require('./middlewares/errorHandlers');


// Debugging mongoose queries
mongoose.set('debug', true);

const app = express();

//app.use(morganMiddleware);

app.use(cors());
app.use(errorHandler);
app.use(notFoundHandler);
app.use(asyncErrorHandler)

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};
// parse data with connect-multiparty.
// app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
// app.use(formData.format());
// change the file objects to fs.ReadStream
// app.use(formData.stream());
// union the body and the files
// app.use(formData.union());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());

app.all('/*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  next();
});

app.use('/assets', express.static('assets'));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Demonstrate the readyState and on event emitters
// console.log(mongoose.connection.readyState); //logs 0
mongoose.connection.on('connecting', () => {
  console.log('connecting');
  // console.log(mongoose.connection.readyState); //logs 2
});
mongoose.connection.on('connected', () => {
  console.log('connected');
  // console.log(mongoose.connection.readyState); //logs 1
});
mongoose.connection.on('disconnecting', () => {
  console.log('disconnecting');
  // console.log(mongoose.connection.readyState); // logs 3
});
mongoose.connection.on('disconnected', () => {
  console.log('disconnected');
// console.log(mongoose.connection.readyState);
//logs 0
});

mongoose.set('strictQuery', true);
mongoose.connect(`${process.env.MONGODB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

 mongoClient.connect()

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// cron.schedule("* * * * *", function () {
//   console.log("===========cron =======")
//   emailSend.cronEmail();
// });

module.exports = app;
  