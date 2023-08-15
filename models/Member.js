import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    name: String,
    position: String,
    image: String
});

export { MemberSchema };