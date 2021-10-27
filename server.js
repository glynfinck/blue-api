const dotenv = require('dotenv');
const mongoose = require('mongoose');

// getAuth()
//   .verifyIdToken(idToken)
//   .then((decodedToken) => {
//     const uid = decodedToken.uid;
//     // ...
//   })
//   .catch((error) => {
//     // Handle error
//   });

// process.on('uncaughtException', (err) => {
//   console.log(err);
//   console.log('UNCAUGHT EXCEPTION! SHUTTING DOWN...');
//   process.exit(1);
// });

dotenv.config({ path: './private/config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<USERNAME>',
  process.env.DATABASE_USERNAME
).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// process.on('unhandledRejection', (err) => {

//   console.log(err.name, err.message);
//   console.log('UNHANDLED REJECTION! SHUTTING DOWN...');
//   server.close(() => {
//     process.exit(1);
//   });
// });
