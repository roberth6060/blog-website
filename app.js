//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const {
    text
} = require("body-parser");
const { response } = require("express");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Vestibulum bibendum porta blandit. Proin faucibus, \ntortor eleifend pulvinar efficitur, urna est sodales dui, ac condimentum massa eros vestibulum mauris. Vestibulum placerat aliquet felis, a vulputate purus elementum id. Vivamus consectetur ante vel urna imperdiet, pellentesque maximus leo luctus. Nam ut gravida arcu. In et erat nisl. Mauris dignissim, ante nec accumsan rhoncus, leo metus aliquam justo, at maximus massa tortor vel sapien. Quisque ac sem ipsum. Ut mollis mollis tortor, ac tempus purus ultricies id. Nam ac felis a nunc faucibus efficitur sit amet ac erat. Nam rhoncus ornare hendrerit. Maecenas pharetra, justo sed placerat consequat, velit est posuere lacus, nec ultricies diam orci ut nulla. Nulla quis nulla ut ligula ultrices commodo eu et nibh. Ut eget mauris malesuada, finibus ante ut, luctus libero. Aliquam gravida dolor quis augue maximus blandit nec non orci. In eget sem in massa efficitur pretium eget quis mi. Etiam quis arcu convallis, mollis quam non, laoreet ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer convallis efficitur dictum. Nullam sed laoreet massa, non congue purus. Duis purus tellus, ornare a mauris tempor, consequat efficitur erat. Aliquam condimentum diam ut pretium consectetur. Aliquam egestas interdum convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse sit amet accumsan lectus. Morbi metus turpis, rhoncus aliquet tempor non, pulvinar eget orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
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
        posts: posts,
        aboutHome: aboutContent
    });
});

//About Page
app.get("/about", function (req, res) {
    res.render("about", {
        about: aboutContent
    });
});

//Blog Page
app.get("/blog", function (req, res) {
    
    res.render("blog", {
          posts: posts
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

    for (var i = 0; i < req.files.length; i++) {
        var response = req.files[i].path;
     
        console.log(response);
    }
    const post = {

        userTitle: req.body.userTitle,
        userImage: response,
        userPost: req.body.userPost
    };
    posts.push(post);
    res.redirect("/")
});

app.get("/posts/:postName", (req, res) => {
    const requestedTitle = _.lowerCase(req.params.postName);
    //Gives access to each indivdual post inside post array:
    posts.forEach((post) => {
        const storedTitle = _.lowerCase(post.userTitle);
        if (storedTitle === requestedTitle) {
            
            res.render("post", {
                title: post.userTitle,
                image: post.userImage,
                content: post.userPost
            });
        }
    })

});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});