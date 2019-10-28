const dotenv = require('dotenv');

const mongose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCOUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB Connection successful!'));

// LISTENING TO THE SERVER
const port = process.env.PORT || 3000;

console.log(process.env.NODE_ENV);
const server = app.listen(port, () => {
  console.log(`Listning to the server ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process Terminated!!!!!!!!!!!!!!!!!!');
  });
});
