const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    tasks:[
        {
            type: mongoose.Types.ObjectId,
            ref: "Task" // collection name - not model name
        }
    ]
})

module.exports = userSchema;