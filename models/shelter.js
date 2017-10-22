var mongoose = require("mongoose")

var shelterSchema = mongoose.Schema({
    name:String,
    type: String,
    long: Number,
    lat: Number,
    capacity: Number,
    spotsLeft: Number
})

module.exports = mongoose.model("Shelter", shelterSchema);