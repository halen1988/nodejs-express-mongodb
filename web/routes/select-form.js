/**
 * Created by admin on 2018/7/18.
 */

const { RADIO, CHECKBOX } = require('./common/constant');
const { insertDocuments, findDocuments, updateDocument, removeDocument } = require('./common/mongodbApi');


module.exports = function(router, settings) {
	router.post('/select/select-form', function(req, result) {
		if (!result) {
			return;
		}
		
		const body = req && req.body;


		const {selectType, typeNum, answerType, questionNum} = body;

		let selectTypeObj = [];
		let answerTypeObj = {};

		for(let i=0, ilen = selectType.length; i<ilen; i++){
			selectTypeObj.push({
				selectType:selectType[i],
				typeNum:typeNum[i]
			});
		}

		console.log(JSON.stringify(selectTypeObj) +'11111');

		
		// result.redirect(`/select-question-list?questionNum=${questionNum}&answerType=${answerType}&selectType=${selectType}&typeNum=${typeNum}`);
		
	});
}