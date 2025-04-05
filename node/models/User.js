const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please enter your full name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      validate: [
        {
          validator: validator.isEmail,
          message: 'please enter a valid email',
        },
        {
          async validator(value) {
            const user = await this.constructor.findOne({ email: value });
            return !user;
          },
          message: 'Email already exists',
        },
      ],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      select: false,
      maxLength: 20,
      validate: {
        validator(value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
        },
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long',
      },
    },
    subscriptions: {
      type: Array,
    },
    logs: {
      type: [{
        status: String,
        timestamp: Date,
      }],
    }
  },
  { timestamps: true },
);

userSchema.methods.correctPassword = function (comingPassword, realPassword) {
  return bcrypt.compare(comingPassword, realPassword);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
