const express = require("express")
const app = express();
const path = require("path")
const passport = require("passport")
const LocalStrategy = require('passport-local')
const session = require("express-session")
const methodOverride = require('method-override')
const User = require("./models/user")
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/TypeMaster')
    .then(() => {
        console.log("DATABASE Connected")
    })
    .catch(err => {
        console.log(err)
    })
const sessionConfig = {
    secret: "fsdgfsd",
    resave: false,
    saveUninitalized: true,
    cookie: {
        httpOnly: true,
    }
}
app.set("views", path.join(__dirname, "views"));
app.set(express.static(path.join(__dirname, "publicS")))
app.set("view engine", "ejs")

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static("publicS"))
app.use(session(sessionConfig))
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/login', (req, res) => {
    res.render("AuthPage/index")
})
app.get('/signUp', (req, res) => {
    res.render("SignUpPage/index")
})
app.get('/home', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.render("TypePage/index")
})
app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    res.redirect("/home");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: '/home',
    failureRedirect: '/login'
}), (req, res) => {
})
app.post("/signUp", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        res.redirect("/home")
    } catch {
        res.redirect("/signUp")
    }
})

app.listen(5000, console.log("Listening"))