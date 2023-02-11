const app = require("./app.js");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database.js");

//Config
dotenv.config({ path: "backend/config/config.env" });

//Databse Connecting

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down server due to unhandled rejection`);

  server.close(() => {
    process.exit(1);
  });
});
