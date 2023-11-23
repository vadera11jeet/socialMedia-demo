const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { users: UserModel } = require("../models");
const sendEmail = require("../utils/mailSetup");

const catchAsync = require("../utils/catchAsync");
const { Op } = require("sequelize");

const signToken = (id, tokenExpireTime = process.env.JWT_EXPIRES_IN) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: tokenExpireTime,
  });
  return token;
};

const sendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("chatAppToken", token, cookieOption);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  if (!req.body.firstName || !req.body.lastName) {
    return res.status(400).json({
      message: "provide first name and lastName",
    });
  }

  try {
    const user = await UserModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "provide email id and password",
    });
  }

  try {
    const user = await UserModel.findOne({
      where: {
        email: { [Op.eq]: email },
      },
    });

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "provide correct email address or password",
      });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        message: "provide correct email address or password",
      });
    }

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  try {
    const userList = await UserModel.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    res.status(200).json({
      status: "success",
      totalUser: userList.length,
      data: userList,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await UserModel.findOne({
    where: {
      id: {
        [Op.eq]: req.params.id,
      },
    },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "user with given id not exists",
    });
  }

  return res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  try {
    const { chatAppToken: token } = req.cookies;

    if (!token) {
      return res.status(400).json({
        status: "failed",
        message: "login to access this resource",
      });
    }

    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await UserModel.findByPk(decode.id);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "can't find user associate with this token",
      });
    }

    req.user = user.toJSON();

    next();
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
});

exports.logout = catchAsync(async (req, res, next) => {
  try {
    res.clearCookie("chatAppToken");
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "fail",
      message: "provide email address",
    });
  }

  try {
    const user = await UserModel.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "can't find user belows to this email",
      });
    }

    const token = signToken(user.id, process.env.FORGOT_PASSWORD_EXPIRE_TIME);
    await UserModel.update(
      { resetToken: token },
      {
        where: {
          id: user.id,
        },
        returning: true,
      }
    );

    await sendEmail(
      email,
      "Email for password reset",
      `this link is valid for only 2 minutes ${process.env.FRONTEND_RESET_PASSWORD_URL}/${user.id}/${token}`
    );

    return res.status(200).json({
      status: "success",
      message: "mail sent",
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

exports.validateForgotPasswordToken = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      status: "fail",
      message: "provide userId and token",
    });
  }

  try {
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    const user = await UserModel.findByPk(decodedToken.id);

    if (!user || !decodedToken.id) {
      return res.status(401).json({
        status: "fail",
        message: "your link has been expired",
      });
    }

    return res.status(200).json({
      status: "success",
      isUserValid: true,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "invalid request",
    });
  }

  try {
      
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const user = await UserModel.findByPk(decodedToken.id);

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "invalid link please try again",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await UserModel.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: decodedToken.id,
        },
        validate: false,
      }
    );
    res.status(200).json({
      status: "success",
      message: "password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
});

// exports.deleteMe = catchAsync(async (req, res, next) => {
//   await UserModel.destroy({
//     where: {
//       id: req.user.id,
//     },
//   });

//   return res.status(204).json({
//     status: "success",
//   });
// });
