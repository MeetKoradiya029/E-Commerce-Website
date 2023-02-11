const ErrorHandler = require("../utils/errorhandler");
const catchAsync = require("./catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.isAuthenticated = catchAsync(async(req,res,next)=>{
    const {token}  = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to access this resource",401))
    }
    // console.log(token)

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id)

    // console.log(req.user)
    next();
})


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHander(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  };
  