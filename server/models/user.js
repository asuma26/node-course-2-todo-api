var mongoose=require('mongoose');


var User = mongoose.model('Users', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

module.exports={User};//u can just write the name if the mapping name and function name is same
