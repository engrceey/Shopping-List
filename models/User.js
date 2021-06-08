const mongoose = require('mongoose')
const validator = require('mongoose-validator')

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },
    role: {
       type : String,
       required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

    
})

module.exports = mongoose.model('User', UserSchema )