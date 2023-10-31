const connectToMongo = require('./Database/conn')
const express = require('express');
var cors = require('cors')

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors())
app.use(express.json());
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/notes', require('./Routes/notes'));

app.get('/', (req, res)=>{
    res.send('Hello World');
})

app.listen(PORT, ()=>{
    connectToMongo();
    console.log(`Connected to express Server on ${PORT}`);
})