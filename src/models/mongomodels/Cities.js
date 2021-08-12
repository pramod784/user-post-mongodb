const mongoconnect = require("../../config/mongoConnection")
module.exports = mongoconnect.model('cities', 
        {
            id: {
                type:String,
                required:false
            },
            name: {
                type:String,
                required:false
            },
            state: {
                type:String,
                required:false,
            }
        }
)
