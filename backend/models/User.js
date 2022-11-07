const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true}, // unique: true ensures email is unique in DB
    password: { type: String, required: true}
});

//Ensure unique user using mongoose-unique-validator
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

// TODO: check Mongoose Unique Validator to ensure each user email is unique