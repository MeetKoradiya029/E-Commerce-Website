const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Databse is connected :${data.connection.host}`);
    });
};

module.exports = connectDatabase;
