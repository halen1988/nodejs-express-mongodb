/**
 * Created by admin on 2018/7/18.
 */
const settings = require('../../../settings-dev.json');
const mongo = require('./api');
// Connection URL
const url = settings.mongo_connect_url;

// Database Name
const dbName = settings.mongo_dbname;

//collection table
const mongoCollection = settings.mongo_collection;
// console.log(new mongo);

const col = new mongo.MongoCollection(settings.mongo_connect_url, settings.collection_name, settings.mongo_pool_size);
module.exports = col;


