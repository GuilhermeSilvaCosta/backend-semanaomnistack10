const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-ygfip.mongodb.net/week10?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
    return res.json({ message: 'hello omnistack'});
    
})

app.listen(3333);