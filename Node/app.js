const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const expressValidator = require ('express-validator')
require ("dotenv").config()

//import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const reviewRoutes = require('./routes/review')
const skillRoutes = require('./routes/skill')
const educationRoutes = require('./routes/education')
const certificationRoutes = require('./routes/certification')



//app
const app = express()

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log("DB works!"));
//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", reviewRoutes);
app.use("/api", skillRoutes);
app.use("/api", educationRoutes);
app.use("/api", certificationRoutes);



const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running in ${port}`);
});