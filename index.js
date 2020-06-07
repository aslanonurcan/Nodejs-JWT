const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//Connect Db
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true,useUnifiedTopology: true },
()=>console.log('connected to db!'))

//Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

app.listen(3000,()=>console.log('Server start'));