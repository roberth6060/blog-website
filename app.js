//jshint esversion:6
/* ====== Require Module Section ====== */
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const mongoose = require("mongoose");
const moment = require("moment");
const { text } = require("body-parser");
const { response } = require("express");

/* ======= Mongoose DataBase ======= */
main().catch((err) => console.log(err));
async function main() {
  /* OPEN CONNECT */
  mongoose.connect(
    "mongodb+srv://roberth60:NIara2020@cluster0.5iczx.mongodb.net/blogDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  );

  const postSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "Please type something!😒"],
    },
    image: String,
    createdOn: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      required: [true, "Please type something!😒"],
    },
  });

  const Post = mongoose.model("Post", postSchema);

  /* ====== Starting Content ====== */
  const homeStartingContent =
    "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
  const aboutContent =
    "Vestibulum bibendum porta blandit. Proin faucibus, \ntortor eleifend pulvinar efficitur, urna est sodales dui, ac condimentum massa eros vestibulum mauris. Vestibulum placerat aliquet felis, a vulputate purus elementum id. Vivamus consectetur ante vel urna imperdiet, pellentesque maximus leo luctus. Nam ut gravida arcu. In et erat nisl. Mauris dignissim, ante nec accumsan rhoncus, leo metus aliquam justo, at maximus massa tortor vel sapien. Quisque ac sem ipsum. Ut mollis mollis tortor, ac tempus purus ultricies id. Nam ac felis a nunc faucibus efficitur sit amet ac erat. Nam rhoncus ornare hendrerit. Maecenas pharetra, justo sed placerat consequat, velit est posuere lacus, nec ultricies diam orci ut nulla. Nulla quis nulla ut ligula ultrices commodo eu et nibh. Ut eget mauris malesuada, finibus ante ut, luctus libero. Aliquam gravida dolor quis augue maximus blandit nec non orci. In eget sem in massa efficitur pretium eget quis mi. Etiam quis arcu convallis, mollis quam non, laoreet ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer convallis efficitur dictum. Nullam sed laoreet massa, non congue purus. Duis purus tellus, ornare a mauris tempor, consequat efficitur erat. Aliquam condimentum diam ut pretium consectetur. Aliquam egestas interdum convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse sit amet accumsan lectus. Morbi metus turpis, rhoncus aliquet tempor non, pulvinar eget orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

  /* ====== Date ====== */

  /* ====== Upload Images Using Multer ====== */
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      var dir = "./uploads";
      //Create directory programmatically:
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, dir);
    },
    filename: (req, file, callback) => {
      let fullName = Date.now() + path.extname(file.originalname);
      callback(null, fullName);
    },
  });
  const upload = multer({
    storage: storage,
  });

  /* ====== app.use ====== */
  app.use(
    bodyParser.urlencoded({
      exteneded: true,
    })
  );
  app.use(express.static("public"));
  app.use("/uploads", express.static("uploads"));
  app.use("/public/", express.static("./public"));

  /* ====== ejs module====== */
  app.set("view engine", "ejs");

  /* ============ Get Routes ============ */
  //Home Page:
  app.get("/", function (req, res) {
    Post.find({}, function (err, posts) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
        aboutHome: aboutContent,
      });
    });
  });
  //About Page:
  app.get("/about", function (req, res) {
    res.render("about", {
      about: aboutContent,
    });
  });
  //Blog Page:
  app.get("/blog", function (req, res) {
    Post.find({}, function (err, posts) {
      res.render("blog", {
        startingContent: homeStartingContent,
        posts: posts,
        aboutHome: aboutContent,
      });
    });
  });
  //Contact Page:
  app.get("/contact", function (req, res) {
    res.render("contact", {
      contact: contactContent,
    });
  });
  //Compose Page:
  app.get("/compose", (req, res) => {
    res.render("compose");
  });
  // Dynamic Page:
  app.get("/posts/:postId", function (req, res) {
    const requestedPostId = req.params.postId;

    Post.findOne(
      {
        _id: requestedPostId,
      },
      function (err, post) {
        res.render("post", {
          title: post.title,
          image: post.image,
          content: post.content,
        });
      }
    );
  });

  /* ============ Post Routes ============ */
  //Compose Page:
  app.post("/compose", upload.array("imageFile", 12), (req, res, next) => {
    for (var i = 0; i < req.files.length; i++) {
      var response = req.files[i].path;

      console.log(response);
    }
    const post = new Post({
      title: req.body.userTitle,
      image: response,
      content: req.body.userPost,
    });

    post.save(function (err) {
      if (!err) {
        res.redirect("/");
      }
    });
  });

  /* ============ Current Port ============ */
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 3000;
  }
  app.listen(port, function () {
    console.log("Server has started successfully");
  });
}
