const router = require("express").Router();
const mongoose = require("mongoose");
const Card = mongoose.model("Cards");
const middleware = require("../Helpers/middleware");

//read all card
app.get("/cards", middleware.authen,async function(req, res, next) {
  try {
    const card = await Card.find({}, null);
    res.json(card);
  } catch (err) {
    next(err);
  }
});

//create
app.post("/cards", middleware.authen, async function(req, res, next) {
  try {
    let newCard = new Card(req.body);
    newCard.owner = req.userDecode.user.username;
    const card = await newCard.save();
    return res.json(card);
  } catch (err) {
    next(err);
  }
});

//read one
app.get("/cards/:cardId", async function(req, res, next) {
  try {
    const card = await Card.findById(req.params.cardId);
    res.json(card);
  } catch (err) {
    next(err);
  }
});

//update
app.post("/cards/:cardId", middleware.authen, async function(req, res, next) {
  try {
    let username = req.userDecode.user.username;
    const _card = await Card.findById(req.params.cardId);
    let owner = _card.owner;
    if (username !== owner) {
      return res.status(401).json({
        message: "Only owner can update"
      });
    }

    let newCard = req.body;
    const card = await Card.findByIdAndUpdate(req.params.cardId, newCard);
    res.json(card);
  } catch (err) {
    next(err);
  }
});

//delete
app.delete("/cards/:cardId", middleware.authen, async function(req, res, next) {
  try {
    let username = req.userDecode.user.username;
    const _card = await Card.findById(req.params.cardId);
    let owner = _card.owner;

    if (username !== owner) {
      return res.status(401).json({
        message: "Only owner can delete"
      });
    }

    const card = await Card.findByIdAndRemove(req.params.cardId);
    const response = {
      message: "Delete card id: " + req.params.cardId + " successfully",
      id: card._id
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
