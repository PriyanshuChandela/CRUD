require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

console.log("MongoDB URL:", process.env.MONGODB_URL);

//database connection

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log("Database connection failed", error));


//middlewares

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(
    session({
        secret: "my secret key",
        saveUninitialized:true,
        resave:false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message; // Use req.session instead of res.session
    delete req.session.message;
    next();
});

app.use('/uploads', express.static('uploads'));



//set tempplate engine

app.set('view engine', "ejs");

//route prefix

app.use("", require("./routes/routes"));

app.listen(PORT, ()=>{
    console.log(`Server Started at ${PORT}`);
})