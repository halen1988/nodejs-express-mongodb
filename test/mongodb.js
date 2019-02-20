/**
 * Created by admin on 2018/7/17.
 */
const api = require('../settings-dev.json');


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


const findDocuments = (obj, callback) => {
	MongoCollection(function(db, client) {
		// Get the documents collection
		const collection = db.collection(mongoCollection);
		// Find some documents  {'a': 3}
		collection.find(obj).toArray(function(err, docs) {
			// assert.equal(err, null);
			console.log("Found the following records");
			callback(docs);
			client.close();
		});
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

const MongoCollection = async(callback) => {
	// Use connect method to connect to the server
	await MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		// console.log("Connected successfully to server");
		
		const db = client.db(dbName);
		
		return callback(db, client);
		
		// removeDocument(db, function() {
		// 	console.log('remove');
		// 	client.close();
		// });
		
		// indexCollection(db, function() {
		// 	console.log('ok');
		// 	client.close();
		// });
		
	});
}

exports.MongoCollection = MongoCollection;
exports.insertDocuments = insertDocuments;
exports.findDocuments = findDocuments;
exports.updateDocument = updateDocument;
exports.removeDocument = removeDocument;




