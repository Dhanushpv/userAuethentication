const express= require('express');
const app =express();
const dotevn = require('dotenv');
dotevn.config();

const mongoConnect = require('./db/connections');

const router = require('./routes/userrouter');
 const authrouter = require ('./routes/authrouter')

app.use(express.static("../client"));
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(router);
mongoConnect();
app.use(authrouter);
app.use('uploads',express.static('./uploads/users'))



app.listen(process.env.PORT,() =>{
    console.log(`Server running at http://localhost:${process.env.PORT}`);
})
