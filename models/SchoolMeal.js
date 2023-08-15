import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SchoolMealSchema = new Schema({
    date: {
        type: Date,
        default: new Date()
    },
    value: {type: String},
    meal: {type: [String]},
    image: {type: String}
});

export { SchoolMealSchema };
