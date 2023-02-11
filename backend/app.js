const express = require('express')
const app = express()
const productRoutes = require('./routes/productRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const cors = require('cors');
const errorMiddleware = require("./middleware/error.js")
const cookieParser = require("cookie-parser")
const orderRoutes = require('./routes/orderRoutes.js');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({
    extended:true
    }));
app.use(cookieParser());


app.use('/api',productRoutes)
app.use('/api/users',userRoutes)
app.use('/api/orders',orderRoutes);

// app.use('/api',userRoutes)

app.use(errorMiddleware)




module.exports = app;

