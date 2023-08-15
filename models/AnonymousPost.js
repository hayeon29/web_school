import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const AnonymousPostSchema = new Schema({
    title: String,
    writer: String,
    writerID: String,
    date: {
        type: Date,
        default: new Date()
    },
    hits: {
        type: Number,
        default: 0
    },
    content: String
});

export { AnonymousPostSchema };
