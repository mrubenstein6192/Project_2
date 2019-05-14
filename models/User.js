const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const {
  Schema
} = mongoose;

const SearchSchema = new Schema({
  searchTerm: {
    type: String,
    required: true
  }
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\../, "Please enter a valid email!"]
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String
  },
  fullName: {
    type: String
  },
  searches: [SearchSchema]
});

UserSchema.pre("save", function createPassword(next) {
  if (this.isNew || this.isModified("password")) {
    const document = this;

    bcrypt.hash(this.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  }
});

UserSchema.methods.isCorrectPassword = function isCorrectPassword(password) {
  const document = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, document.password, function compareCallback(err, same) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(same);
      }
    });
  });
}

UserSchema.methods.setFullName = function setFullName() {
  this.fullName = `${this.firstName} ${this.lastName}`;
  return this.fullName;
}

module.exports = mongoose.model("User", UserSchema);