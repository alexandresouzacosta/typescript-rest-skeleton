import * as mongoose from 'mongoose';

export interface Entity extends mongoose.Document { 
  getVersion(): Number;
}
