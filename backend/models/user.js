const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  // avec unique: true on empeche que plusieurs ux utilisent la meme email, mais on peut avoir des erreurs illisibles de mongodb
  email:{type: String, required: true, unique: true},
  password:{type : String, required: true}
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
