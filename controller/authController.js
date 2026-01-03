const { promisify } = require('util');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const { sendEmail } = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.signUpUser = catchAsync(async (req, res, next) => {
  const reqBody = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  };
  const newUser = await User.create(reqBody);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide valid email and password'), 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid password or email', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Check if the token exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError(
        'You are not logged in! Please logged in to get access',
        401,
      ),
    );
  // VERIFICATION
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  // Check if the user exist
  const currentUser = await User.findById(decode.id);

  if (!currentUser)
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );

  //Check if the password changed
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  res.locals.user = currentUser;
  req.user = currentUser;

  next();
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'Log out', {
    httpOnly: true,
    expires: new Date(Date.now() + 10000),
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      next(new AppError("You don't have permission to do the action", 403));

    next();
  };
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decode = await promisify(jwt.verify)(
        req.cookies?.jwt,
        process.env.JWT_SECRET_KEY,
      );

      const currentUser = await User.findById(decode.id);

      res.locals.user = currentUser;

      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body?.email });

  if (!user)
    return next(new AppError('There is not user with that email', 404));

  const resetToken = user.createPasswordResetToken();

  user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(err.message), 500);
  }

  next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log('working');
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log(hashedToken);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresIn: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  console.log(req.user.id);
  console.log(req.body);
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
