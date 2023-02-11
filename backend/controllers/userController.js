const ErrorHandler = require("../utils/errorhandler.js");
const catchAsync = require("../middleware/catchAsync");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail");
const getResetPassToken = require("../models/userModel");

// Register user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample id",
      url: "profilepicurl",
    },
  });

  // const token = user.getJWTtoken();

  // res.status(201).json({ success: true, token });

  sendToken(user, 201, res);
});

//Login user
module.exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //checking user has given both email and pass or not
  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPassMatch = user.comparePassword(password);

  if (!isPassMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // const token = user.getJWTtoken();

  // res.status(200).json({ success: true, token });

  sendToken(user, 200, res);
});

//logout
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

//Forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found ! ", 404));
  }

  //Getting Reset password token
  const resetToken = user.getResetPassToken();
  await user.save({ validateBeforeSave: false });

  const resetPassUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const message = `Your reset password url is : \n\n ${resetPassUrl} \n\nIf you have not requested this email, please ignore it`;

  try {
    console.log(user.email);
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message: message,
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    });

    await res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//Get User Detail
exports.getUserDetails = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, user });
});

//Update Password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPassMatch = await user.comparePassword(req.body.oldPassword);

  if (!isPassMatch) {
    return next(new ErrorHandler("old Password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//Update profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

//Get all users (admin)
exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// Get Single user(admin)
exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with this id:${req.params.id}`,400)
    );
  }

  res.status(200).json({ success: true, user });
});

//Update usr role(Admin)
exports.updateRole = catchAsync(async(req,res,next)=>{
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role:req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({success:true})


})

//Delete User(admin)
exports.deleteUser = catchAsync(async(req,res,next)=>{
  

 const user = await User.findById(req.params.id)

  if(!user){
    return next(new ErrorHandler(`User does not exist with this id:${req.params.id}`,400))
  }

  await user.remove();


  res.status(200).json({success:true})


})