import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
    date: {
        type: Date,
        default: new Date()
    },
    content: String
});

export { CalendarSchema };