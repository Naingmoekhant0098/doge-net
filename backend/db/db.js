const mongodb = require("mongoose");
require("dotenv").config();

const db = async () => {
  await mongodb
    .connect(process.env.mongodb_str)
    .then((res) => {
      console.log("Mongoose Sever connected successfully");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
db();
