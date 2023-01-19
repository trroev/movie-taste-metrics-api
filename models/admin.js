const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;
const { DateTime } = require("luxon");

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// hash plain text password before save
AdminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    const salt = await bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(admin.password, salt);
    admin.password = hashedPassword;
  }
  next();
});

// compare hashed password
AdminSchema.methods.isValidPassword = function (password) {
  const admin = this;
  return bcrypt.compareSync(password, admin.password);
};

AdminSchema.virtual("post_date_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("Admin", AdminSchema);
