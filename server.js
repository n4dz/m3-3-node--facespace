"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

const findUser = (value) => {
  return users.find((user) => Object.values(user).includes(value)) || null;
};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", { users: users });
};

const handleProfilePage = (req, res) => {
  const userIdWeGot = req.params.userId;
  let theProfile;
  let friendsProfileId = [];
  let friendsProfileInfo = [];

  users.forEach((element) => {
    if (element._id == userIdWeGot) {
      theProfile = element;
      friendsProfileId = element.friends;
    }
  });

  users.forEach((element) => {
    if (friendsProfileId.includes(element._id)) {
      friendsProfileInfo.push(element);
    }
  });

  res.status(200).render("pages/profile", {
    theProfileEjsValue: theProfile,
    theProfileFriends: friendsProfileInfo,
  });
};

const handleSignin = (req, res) => {
  res.status(404).render("pages/signin");
};

const handleName = (req, res) => {
  let firstName = req.query.firstName;
  let currUser = findUser(firstName);
  if (currUser) {
    res.redirect("/users/" + currUser._id);
  } else {
    res.redirect("/signin");
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)
  .get("/users/:userId", handleProfilePage)
  .get("/signin", handleSignin)
  .get("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
