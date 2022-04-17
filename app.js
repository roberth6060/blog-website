//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
    text
} = require("body-parser");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let posts = [];

//Image upload code:
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var dir = "./uploads"
        //Create directory programmatically:
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: (req, file, callback) => {
        console.log(file);
        let fullName = Date.now() + path.extname(file.originalname);
        callback(null, fullName)
    }
});
const upload = multer({
    storage: storage
});

app.use(bodyParser.urlencoded({
    exteneded: true
}));
//Get express to serve up files in public folder:
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));
//Tells app to use ejs module:
app.set("view engine", "ejs");

//Home page:
app.get("/", function (req, res) {
    res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
    });
});

//About Page
app.get("/about", function (req, res) {
    res.render("about", {
        about: aboutContent
    });
});

//Contact Page
app.get("/contact", function (req, res) {
    res.render("contact", {
        contact: contactContent
    });
});

//Compose Page
app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post('/compose', upload.array('imageFile', 12), (req, res, next) => {
    console.log(JSON.stringify(req.file));
    for (var i = 0; i < req.files.length; i++) {
        response = req.files[i].path;
    }

    // return res.send(response);
    const post = {

        userTitle: req.body.userTitle,
        userImage: response,
        userPost: req.body.userPost
    };
    console.log(req.body.userPost);
    posts.push(post);
    res.redirect("/")
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});