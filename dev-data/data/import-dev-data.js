const mongose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const fs = require('fs');

const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data Inserted Successfuly!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deletetData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Deleted Successfuly!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deletetData();
}

console.log(process.argv);
