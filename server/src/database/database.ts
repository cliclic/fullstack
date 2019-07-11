import * as mongoose from 'mongoose'
import { DB_NAME, MONGO_HOST } from '../modules/common/consts'
import initializeDatabase from './initialize-database';

mongoose.connect(`mongodb://${MONGO_HOST || 'localhost'}:27017/${DB_NAME}`, {
  useNewUrlParser: true,
});

initializeDatabase(mongoose.connection);

export default mongoose;
export const connection = mongoose.connection;
