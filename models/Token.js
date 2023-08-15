import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    token: {type: String},
    user_id: {type: String}
});

export { TokenSchema };