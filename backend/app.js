const express = require('express');
const app=express();
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const cors=require('cors');
const errorMiddleware=require('./middleware/error');

const path=require('path');
app.use(express.static(path.join(__dirname,'public')));

app.use(cors({
    origin:['http://localhost:3000','*'],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

const category=require('./routes/categoryRoute');
const brand=require('./routes/brandRoute');
const user=require('./routes/userRoute');
const store=require('./routes/storeRoute');
const product=require('./routes/productRoute');
const review=require('./routes/reviewRoute');
const order=require('./routes/orderRoute');
const payment=require('./routes/paymentRoute');
app.use('/api/v1',category);
app.use('/api/v1',brand);
app.use('/api/v1',user);
app.use('/api/v1',store);
app.use('/api/v1',product);
app.use('/api/v1',review);
app.use('/api/v1',order);
app.use('/api/v1',payment);


app.use(errorMiddleware);
module.exports=app;