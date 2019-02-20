/**
 * Created by admin on 2018/7/18.
 */

const { RADIO, CHECKBOX, QUESTIONTYPE, SELECTTYPE, ANSWER } = require('./common/constant');
const { insertDocuments, findDocuments, updateDocument, removeDocument } = require('./common/mongodbApi');
const url = require('url');




module.exports =  function (router, settings) {
	
	router.post('/select/select-question-list', async function (req, res) {

		if (!res) {
			return;
		}
		
		const body = req && req.body;
		// const bodyobj = {"selectType_1":"1","answerType_1_4":"4","questionNum_1_4":"1","answerType_1_5":"5","questionNum_1_5":"2","answerType_1_6":"6","questionNum_1_6":"3","answerType_1_7":"7","questionNum_1_7":"4","answerType_1_8":"8","questionNum_1_8":"5","answerType_1_9":"9","questionNum_1_9":"6","selectType_2":"2","answerType_2_4":"4","questionNum_2_4":"7","answerType_2_5":"5","questionNum_2_5":"8","answerType_2_6":"6","questionNum_2_6":"9","answerType_2_7":"7","questionNum_2_7":"10","answerType_2_8":"8","questionNum_2_8":"11","answerType_2_9":"9","questionNum_2_9":"12","selectType_3":"3","answerType_3_4":"4","questionNum_3_4":"13","answerType_3_5":"5","questionNum_3_5":"14","answerType_3_6":"6","questionNum_3_6":"1","answerType_3_7":"7","questionNum_3_7":"1","answerType_3_8":"8","questionNum_3_8":"1","answerType_3_9":"1","questionNum_3_9":"1"};
		const bodyobj = {"questionNum_1_4":"1", "questionNum_1_5":"1", "questionNum_2_5":"1", "questionNum_3_5":"1", "questionNum_3_7":"1",};

		let objItem = [];

		for (let key in bodyobj){
			let keyobj;
			if(key.indexOf('questionNum') >= 0){
				let keyitem = key.split('_');
				keyobj = {
					selectType:keyitem[1],
					answerType:keyitem[2],
					questionNum:bodyobj[key]
				}
				objItem.push(keyobj);
			} 
		}
		let findList = [];
		const getF = function(objItem) {
			return new Promise(function(resolve, reject) {
				for (let i = 0; i < objItem.length; i++) {
					let item = objItem[i];
					
					let { selectType, answerType, questionNum } = item;
					
					let findWhere = {
						selectType,
						answerType,
					};
					
					findDocuments(findWhere, function(docs) {
						let data = (docs && docs.length > 0 && docs) || [];
						
						for (let i = 0; i < data.length; i++) {
							let item = data[i];
							let typeValue = QUESTIONTYPE.filter(function(itemType) {
								return +item.selectType === itemType.type;
							});
							
							let selectType = SELECTTYPE.filter(function(select) {
								return +item.answerType === select.type;
							});
							
							data[i].selectTypeName = typeValue[0].name;
							data[i].answerTypeName = selectType[0].name;
							data[i].typeName = item.typeName || ''
							
						}
						
						for (let j = 0; j < data.length; j++) {
							let item = data[j];
							findList.push(item);
						}
						console.log(JSON.stringify(findList)+'===findList'+i);
						
						if(i === (objItem.length - 1)) {
							resolve(findList);
						}
						
					}, { 'limitNum': questionNum });
					
				}
				
			});
		}
		getF(objItem).then(function(findList) {
			let radioList = [];
			let checkBoxList = [];
			let answerList = [];
			let newList = [];
			 radioList = findList.filter(function(itemType) {
				 return itemType.selectType === RADIO;
			});
			
			checkBoxList = findList.filter(function(itemType) {
				return itemType.selectType === CHECKBOX;
			});
			
			answerList = findList.filter(function(itemType) {
				return itemType.selectType === ANSWER;
			});
			
			const radioObj = {
				'questionType': '单选',
				'questionList': radioList
			}
			const checkBoxObj = {
				'questionType': '多选',
				'questionList': radioList
			}
			const answerListObj = {
				'questionType': '简答',
				'questionList': radioList
			}
			
			newList = radioList.concat(checkBoxList, answerList);
			
			res.render('select-question-list.html', {
				findListArr:newList
			});
		});
		
		
		
		
		
	});
}