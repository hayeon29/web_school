import mongoose from 'mongoose';

import { AnonymousPostSchema } from '../models/AnonymousPost.js';
import { NoticeSchema } from '../models/Notice.js';

let connection = mongoose.connection;

const AnonymousPost = connection.model('AnonymousPost', AnonymousPostSchema);
const Notice = connection.model('Notice', NoticeSchema);
