const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');
app.set('query parser', 'extended');

// In app.js or server.js
if (process.env.DB_TYPE === 'local') {
  const LOCAL_DB = process.env.LOCAL_DB_URL;
  mongoose
    .connect(LOCAL_DB)
    .then(() => console.log('Local DB is connected successfully.'));
} else {
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD,
  );
  mongoose.connect(DB).then(() => console.log('Db is connected successfully'));
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('The app is listening... on port 3000');
});
