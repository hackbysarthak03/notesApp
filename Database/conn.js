const mongoose = require('mongoose')
const URL = `mongodb+srv://vsarthak62:05012003@cluster0.s1d5e5b.mongodb.net/?retryWrites=true&w=majority`

const connectToMongo = () => {
    mongoose.connect(URL, {
        useNewUrlParser:true, useUnifiedTopology: true
    }).then(()=> console.log('Connected to MongoDB')).catch(err => console.log('Bad Connection'));
}


module.exports = connectToMongo;
