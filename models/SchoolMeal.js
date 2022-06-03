const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchoolMealSchema = new Schema({
    date: {
        type: Date,
        default: new Date()
    },
    breakfast: {
        value: {type: Number},
        meal: {type: [String]},
        image: {type: String}
    },
    lunch: {
        value: {type: Number},
        meal: {type: [String]},
        image: {type: String}
    },
    dinner: {
        value: {type: Number},
        meal: {type: [String]},
        image: {type: String}
    },
})

const SchoolMeal = mongoose.model('SchoolMeal', SchoolMealSchema)
module.exports = SchoolMeal