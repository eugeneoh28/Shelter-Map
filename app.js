var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Shelter = require("./models/shelter"),
    User = require("./models/user"),
    http = require("http").Server(app),
    io = require('socket.io')(http),
    seedDB = require("./seed");

mongoose.connect("mongodb://localhost/shelter_map", {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
//seedDB();

app.set("view engine", "ejs");
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "hello",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    Shelter.find({}, function(err, allShelters){
        if (err) {
            console.log(err);
        } else {
            res.render("home", {shelters : allShelters})
        }   
    })
});

app.get("/count", isLoggedIn, function(req, res) {
    Shelter.find({name:req.user.shelterAssociation}, function(err, foundShelter) {
        if (err) {
            console.log(err);
        } else {
            res.render("count", {shelter:foundShelter})
        }
    })
})

app.get("/login", function(req, res) {
    Shelter.find({}, function(err, allShelters) {
        if (err) {
            console.log(err);
        } else {
            res.render("login", {shelters : allShelters});
        }
    })
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/count",
        failureRedirect: "/login"
    }), function(req, res) {

})
app.get("/register", function(req, res) {
     Shelter.find({}, function(err, allShelters) {
        if (err) {
            console.log(err);
        } else {
            res.render("register", {shelters : allShelters});
        }
    })
});
app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username, shelterAssociation: req.body.shelter});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        Shelter.findOneAndUpdate({name:req.body.shelter}, {$set:{capacity:req.body.spotsLeft}}, function(err, doc) {
            if (err) {
                console.log(err)
            }
            passport.authenticate("local")(req, res, function() {
            res.redirect("/count");
            });
        })
    });
});

app.get("/*", function(req, res) {
  res.redirect("/");
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

io.on('connection', function(socket){
    socket.on('updateCount', function(data) {
        Shelter.findOneAndUpdate({organization:data.org}, {$set:{spotsLeft:data.count}}, function(err, doc) {
            console.log(data.org);
            console.log(data.name);
            if (err) {
                console.log(err);
            }
            console.log(doc);
        });
    })
    socket.on ('refreshMap', function(data) {
        Shelter.find({},function(err, allShelters) {
            if (err) {
                console.log(err);
            } else {
                socket.emit('mapRefresh', {shelters:allShelters});
            }
        })
    })
})

http.listen(3000, function() {
    console.log("shelter started")
})