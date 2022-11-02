const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const taskHandler = require('./Routes/taskHandler.js');

// ~~~~~~~~~~~~~ middlewires ~~~~~~~~~~~~~ //
app.use(express.json());
app.use(cors());

// ~~~~~~~~~~~~ connect to db ~~~~~~~~~~~~ //
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m6gz1sz.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log(err.message))

// ~~~~~~~~~~~~~~~~ Routes ~~~~~~~~~~~~~~~ //
app.use('/task', taskHandler);

// ====================================================== //
// =================== Error handling =================== //
// ====================================================== //
// 404 error handle middleware
app.use((req, res, next) => {
    res.status(404).send({ message: 'URL not found' })
})
//default error handle middlewire
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).send(err.message)
    } else {
        res.status(500).send({ message: 'Server side error' })
    }
})

// ====================================================== //
// ======================= server ======================= //
// ====================================================== //
app.get('/', (req, res) => {
    res.send('Hello World')
})
app.listen(port, () => {
    console.log(`Listenig to ${port}`);
})