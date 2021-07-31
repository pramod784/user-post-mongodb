const mongoconnect = require("../../config/mongoConnection")
module.exports = mongoconnect.model('users', 
        {
            name: {
                type:String,
                required:true
            },
            email: {
                type:String,
                required:true,
                unique:true
            },
            password: {
                type:String,
                required:true,
            },
            role: {
                type:String,
                required:true,
            }
        }
)
