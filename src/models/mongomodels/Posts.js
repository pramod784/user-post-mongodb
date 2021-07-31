const mongoconnect = require("../../config/mongoConnection")
module.exports = mongoconnect.model('posts', 
        {
            title: {
                type:String,
                required:true
            },
            body: {
                type:String,
                required:true
            },
            created_by: {
                type:String,
                required:true,
            },
            created_at: {
                type:Date,
                required:true,
                default: Date.now
            }
        }
)
