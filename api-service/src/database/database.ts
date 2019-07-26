import * as mongoose from 'mongoose'
import { DB_NAME, MONGO_HOST } from '../modules/common/consts'

mongoose.connect(`mongodb://${MONGO_HOST || 'localhost'}:27017/${DB_NAME}`, {
  useNewUrlParser: true,
});

export default mongoose;
export const connection = mongoose.connection;
