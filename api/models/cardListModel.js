const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  status: {
    type: String
  },
  content: {
    type: String
  },
  category: [],
  author: {
    type: String
  },
  owner: {
    type: String,
    require: true
  },
});

module.exports = mongoose.model("Cards", CardSchema);
