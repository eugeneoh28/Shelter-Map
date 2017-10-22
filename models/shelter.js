var mongoose = require("mongoose")

var shelterSchema = mongoose.Schema({
    organization: String,
    name:String,
    type: String,
    population: String,
    minAge: Number,
    maxAge: Number,
    capacity: Number,
    address: String,
    city: String,
    state: String,
    zip: Number,
    phone: String,
    site: String,
    email: String,
    services: String,
    lng: Number,
    lat: Number,
    spotsLeft: Number
})

module.exports = mongoose.model("Shelter", shelterSchema);