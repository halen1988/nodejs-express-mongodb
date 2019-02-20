'use strict'
/**
 * Created by Cherokee on 18-5-28.
 * Usage:
 * const col = new mongo.MongoCollection(settings['mongo_connect_url'], 'collection_name', settings['mongo_pool_size']);
 * All methods return Promise
 * col.find(query,fields,sort,pagesize,pagenum,finalCallback)
 * col.aggregate(query,finalCallback)
 * col.get(id,incrementField,increment,finalCallback)
 * col.findOne(id,fields,finalCallback)
 * col.increment(id,incrementField,increment,finalCallback)
 * col.update(id,document,overide,upsert,finalCallback)
 * col.remove(id,finalCallback)
 * col.save(document,finalCallback)
 */
const MongoClient = require('mongodb').MongoClient;
const poolModule = require('generic-pool');
const ObjectID = require('mongodb').ObjectID;

var pools = {};

/**
 * get pool from system pools
 * @param  {[type]} mongo_connect_url [description]
 * @param  {[type]} mongo_pool_size   [description]
 * @return {[type]}                   [description]
 */
var getPool = async function (mongo_connect_url, mongo_pool_size) {
	if (pools.hasOwnProperty(mongo_connect_url)) {
		// console.log(`get ${mongo_connect_url} from pools`);
		return pools[mongo_connect_url];
	} else {
		// console.log(`new pool for ${mongo_connect_url}`);
		const factory = {
			create: async function () {
				let spos = mongo_connect_url.lastIndexOf('/');
				let connect_db = mongo_connect_url.substring(spos + 1, mongo_connect_url.length);
				let client = await MongoClient.connect(mongo_connect_url, {
					useNewUrlParser: true
				});
				return client.db(connect_db);
			},
			destroy: function (db) {
				db.disconnect();
			}
		};
		
		const opts = {
			'max': mongo_pool_size, // maximum size of the pool
			'min': 1, // minimum size of the pool
			'idleTimeoutMillis': 30000,
			'log': false
		};
		
		const pool = poolModule.createPool(factory, opts);
		pools[mongo_connect_url] = pool;
		return pool;
	}
}

/**
 * Mongo collection class
 * @type {[type]}
 */
exports.MongoCollection = class {
	constructor(mongo_connect_url, mongo_collection, mongo_pool_size) {
		this.mongo_connect_url = mongo_connect_url;
		this.mongo_pool_size = mongo_pool_size || 100;
		this.mongo_collection = mongo_collection;
	}
	
	getOwnPoll() {
		return getPool(this.mongo_connect_url, this.mongo_pool_size);
	}
	
	generateObjectId(idstr) {
		return /^\w{24}$/.test(idstr) ? new ObjectID(idstr) : idstr;
	}
	
	/**
	 * query documents
	 * @param  {[Object]} query         [description]
	 * @param  {[type]} fields        [description]
	 * @param  {[type]} sort          [description]
	 * @param  {[type]} pagesize      [description]
	 * @param  {[type]} pagenum       [description]
	 * @param  {[type]} finalCallback [description]
	 * @return {[Promise]}               [description]
	 */
	
	async find(query, fields, sort, pagesize, pagenum) {
		return this.execute({
			'count': 0,
			'pagesize': 0,
			'pagenum': 0,
			'list': []
		}, async (self, db, query, fields, sort, pagesize, pagenum) => {
			let count = await db.collection(self.mongo_collection).count(query);
			var skipNumber = pagesize * (pagenum - 1);
			var project = {};
			if (fields) {
				if (Array.isArray(fields)) {
					fields.forEach(f => {
						project[f] = 1;
					});
				} else project = fields;
			}
			var sorts = [];
			if (sort) {
				if (Array.isArray(sort)) sorts = sort;
				else {
					for (let k in sort) {
						if (sort.hasOwnProperty(k)) sorts.push([k, sort[k]]);
					}
				}
			}
			let docs = await db.collection(self.mongo_collection).find(query).project(project).sort(sorts).skip(skipNumber).limit(pagesize).toArray();
			return {
				'count': count,
				'pagesize': pagesize,
				'pagenum': pagenum,
				'list': docs
			};
		}, ...arguments);
	}
	
	/**
	 * 原生 find 方法
	 * @param {Object} query
	 */
	async query(searchObj) {
		return this.execute([],
			async (self, db, searchObj) => {
				return await db.collection(self.mongo_collection).find(searchObj).toArray();
			}, ...arguments);
	}
	
	/**
	 * 原生 update()
	 * @param {Object} selector
	 * @param {Object} document
	 * @param {Object} options {multi: default false, upsert: default false}
	 */
	async update(selector, document, options = {}) {
		return this.execute([],
			async (self, db, selector, document, options) => {
				return await db.collection(self.mongo_collection).update(selector, document, options);
			}, ...arguments);
	}
	
	/**
	 * aggregate
	 * @param  {[type]} query         [description]
	 * @param  {[type]} finalCallback [description]
	 * @return {[type]}               [description]
	 */
	async aggregate(query) {
		return this.execute([],
			async (self, db, query) => {
				return await db.collection(self.mongo_collection).aggregate(query).toArray();
			}, ...arguments);
	}
	
	/**
	 * get one record, specify fields
	 * @param  {[object or string]} id            [id or query condition]
	 * @param  {[array ]} fields        [return fields]
	 * @param  {[function]} finalCallback [call back function]
	 * @return {[none]}               [callback]
	 */
	async get(id, fields) {
		return this.execute({},
			async (self, db, id, fields) => {
				var query_cond;
				if (typeof id == 'object') query_cond = id;
				else {
					var objectId = id;
					if (/^[0-9a-z]{24}$/ig.test(id)) objectId = new ObjectID(id);
					query_cond = {
						_id: objectId
					}
				}
				var options = {};
				if (fields) options['fields'] = fields;
				let doc = await db.collection(self.mongo_collection).findOne(query_cond, options);
				return doc;
			}, ...arguments);
	}
	
	/**
	 * just increment field value
	 * @param  {[type]} id             [description]
	 * @param  {[type]} incrementField [description]
	 * @param  {[type]} increment      [description]
	 * @param  {[type]} finalCallback  [description]
	 * @return {[Promise]}                [description]
	 */
	async increment(id, incrementField, increment) {
		return this.execute(0,
			async (self, db, id, incrementField, increment) => {
				let objectId = id;
				if (/^[0-9a-z]{24}$/ig.test(id)) {
					objectId = new ObjectID(id);
				}
				
				let incrementObj = {};
				incrementObj[incrementField] = increment;
				let updateObj = {
					'$inc': incrementObj
				}
				
				return await db.collection(self.mongo_collection).update({
					_id: objectId
				}, updateObj, {
					'w': 1
				});
			}, ...arguments);
	}
	
	/**
	 * remove document
	 * @param  {[type]} id            [description]
	 * @param  {[type]} finalCallback [description]
	 * @return {[Promise]}               [description]
	 */
	async remove(id) {
		return this.execute(0,
			async (self, db, id) => {
				let objectId = id;
				if (/^[0-9a-z]{24}$/ig.test(id)) objectId = new ObjectID(id);
				return await db.collection(self.mongo_collection).remove({
					_id: objectId
				}, {
					'w': 1
				});
			}, ...arguments);
	}
	
	/**
	 * Just save document
	 * @param  {[type]} document      [description]
	 * @param  {[type]} finalCallback [description]
	 * @return {[Promise]}               [description]
	 */
	async save(document) {
		return this.execute(0,
			async (self, db, document) => {
				return await db.collection(self.mongo_collection).insert(document, {
					'w': 1
				});
			}, ...arguments);
	}
	
	async execute(default_value, func, ...param) {
		let self = this;
		let ret = default_value;
		
		let db, pool;
		try {
			pool = await self.getOwnPoll();
			db = await pool.acquire();
			ret = await func.call(null, self, db, ...param);
		} catch (e) {
			console.error(e);
		} finally {
			if (pool && db) pool.release(db);
		}
		return ret;
	}
}