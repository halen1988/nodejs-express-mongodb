/**
 * Created by admin on 2018/7/17.
 */
const api = require('../../../settings-dev.json');

const ObjectID = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = api.mongo_connect_url;

// Database Name
const dbName = api.mongo_dbname;

//collection table
const mongoCollection = api.collection_name;

//insert data
const insertDocuments = async(obj, callback) => {
	MongoCollection(function(db, client) {
		// Get the documents collection
		const collection = db.collection(mongoCollection);
		// Insert some documents
		// const _obj = [
		// 	{a: 1}, {a: 2}, {a: 3}
		// ];
		collection.insertMany(obj, function(err, result) {
			// assert.equal(err, null);
			// assert.equal(3, result.result.n);
			// assert.equal(3, '');
			console.log("Inserted 3 documents into the collection");
			callback(result);
			client.close();
		});
	});
	
}


// db.col.aggregate(
// 	[
// 		{
// 			"$match" : {
// 				"title":"标题匹配条件，查询条件都写在match阶段"
// 			}
// 		}
// 		{
// 			"$sample": { size: 3 }
// 		}
// 	]
// )

const findDocuments =  (obj, callback, opt) => {
	const opts = opt;
	const limitNum = opts && +opts.limitNum;

	 MongoCollection(function(db, client) {
		// Get the documents collection
		const collection = db.collection(mongoCollection);
		// Find some documents  {'a': 3}
		if(limitNum && limitNum > 0){
			collection.aggregate(
				[
					{
						"$match" : obj
					},
					{
						"$sample": { size: limitNum }
					}
				]
			).toArray(function(err, docs) {
				// assert.equal(null, err);
				// assert.equal(3, docs[0].total);
				callback(docs);
				client.close();
			});
			
			 
			// collection.find(obj).limit(limitNum).toArray(function(err, docs) {
			// 	// assert.equal(err, null);
			// 	console.log("Found the following records");
			// 	callback(docs);
			// 	// client.close();
			// });
			
			
			
		}else{
			//id查找
			if(obj._id){
				const id = new ObjectID(obj._id);
				obj._id = id;
			}
			collection.find(obj).toArray(function(err, docs) {
				// assert.equal(err, null);
				console.log("Found the following records");
				callback(docs);
				// client.close();
			});
		}

		
	});
}

const updateDocument = (obj, updateObj, callback) => {
	MongoCollection(function(db, client) {
		// Get the documents collection
		const collection = db.collection(mongoCollection);
		// Update document where a is 2, set b equal to 1 {a: 2} {b: 1}
		collection.update(obj, {$set: updateObj}, function(err, result) {
				// assert.equal(err, null);
				// assert.equal(1, result.result.n);
				console.log("Updated the document with the field a equal to 2");
				callback(result);
				client.close();
		});
		
	});
}

const removeDocument = (obj, callback) => {
	MongoCollection(function(db, client) {
		// Get the documents collection
		const collection = db.collection(mongoCollection);
		// Delete document where a is 3
		collection.deleteOne(obj, function(err, result) {
			assert.equal(err, null);
			assert.deepEqual(1, result.result.n, '删除失败');
			console.log("Removed the document with the field a equal to 3");
			callback(result);
			client.close();
		});
	});
}

const indexCollection = (db, callback) => {
	const collection = db.collection(mongoCollection);
	collection.createIndex(
		{"a": 2222},
		null,
		function(err, results) {
			console.log(results);
			callback();
		}
	);
}

const MongoCollection = (callback) => {
	// Use connect method to connect to the server
	 MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		// console.log("Connected successfully to server");
		
		const db = client.db(dbName);
		
		return callback(db, client);
		
	});
}

exports.MongoCollection = MongoCollection;
exports.insertDocuments = insertDocuments;
exports.findDocuments = findDocuments;
exports.updateDocument = updateDocument;
exports.removeDocument = removeDocument;




