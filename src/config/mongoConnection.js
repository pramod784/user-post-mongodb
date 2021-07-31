const mongoose = require("mongoose")
require("dotenv/config")
mongoose.connect(process.env.MONGO_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected successfully!")    
});
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);
module.exports = mongoose;