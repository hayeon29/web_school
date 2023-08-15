import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NoticeSchema = new Schema({
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

export { NoticeSchema };