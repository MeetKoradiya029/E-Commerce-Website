const ErrorHandler = require("../utils/errorhandler.js");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

 
  //Duplicate key error
  if(err.code === 11000 ){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
    err = new ErrorHandler(message, 400)
  }

  //Wrong JWT error
  if(err.name === "JsonWebTokenError"){
    const message = `Json Web Token is invalid, try again`

    err = new ErrorHandler(message,400);
  }

  //Token Expire Error
  if(err.name === "TokenExpiredError"){
    const message = `Json Web Token is Expired, try again`

    err = new ErrorHandler(message,400);
  }


  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
  console.log(err.message);
};
