const mongoose = module.require('mongoose');
const uniqueValidator = module.require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
