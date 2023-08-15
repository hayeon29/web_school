import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URL;

export const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true); 
  }

  mongoose.connect(url, {
    dbName: 'test', 
    useNewUrlParser: true,
  }, (error) => {
    if (error) {
      console.log('connect error', error);
    } else {
      console.log('connect success');
    }
  });
}

mongoose.connection.on('error', (error) => {
  console.error('connect error', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('disconnected. retry connection');
  connect(); 
});


