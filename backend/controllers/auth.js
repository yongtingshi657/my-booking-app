const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const { email} = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequestError("User already exists")
  }

  const user = await User.create({ ...req.body });
  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({ user:{name:user.name}, token});
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please fill all the field');
  }

  const user = await User.findOne({ email });

  // verify if email and password are correct
  if (!user) {
    throw new UnauthenticatedError('Inavild Credentials')
  }

  const isPasswordCorrect = await user.matchPassword(password)
   if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Inavild Credentials')
  }
 
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user:{name:user.name}, token});
};

const getMe = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

module.exports = { register, login, getMe};
