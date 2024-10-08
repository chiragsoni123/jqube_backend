const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] // regex for checking the email format
    },
    password: { 
        type: String,
        required: true 
    },
    role: {
        required: true,
        type: String,
        enum: ['admin', 'user','gold','silver','bronze'] //allowed values are these only role.
    },

});

module.exports = mongoose.model('User', userSchema);
