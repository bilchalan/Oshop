const app=require('./app');

const path=require('path');

const connectDatabase=require('./config/database');

const dotenv=require('dotenv');


const port=process.env.PORT || 9000;

if(process.env.NODE_ENV !=='PRODUCTION'){
    dotenv.config({path:'config/config.env'})
}

const server=app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
    connectDatabase();
})