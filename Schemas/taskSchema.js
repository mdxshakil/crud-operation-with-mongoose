const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: String,
    status:{
        type: String,
        required: true,
        enum: ['active', 'idle']
    },
    date:{
        type: Date,
        default: Date.now
    }
})

// =========== mongoose schema instance method ========== //
taskSchema.methods = {
    findActive: function () {
        return mongoose.model('Task').find({status: 'active'});
    }
}

// =========== mongoose schema statics method ========== //
taskSchema.statics = {
    findFramework: function () {
        return this.find({name: /tailwind/i})
    }
}

// =========== mongoose schema query method ========== //
taskSchema.query = {
    findDescription: function (description) {
        return this.find({description: new RegExp(description, "i")})
    }
}



module.exports = taskSchema;