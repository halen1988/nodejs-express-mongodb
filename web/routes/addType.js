/**
 * Created by admin on 2018/7/18.
 */

const { RADIO, CHECKBOX } = require('./common/constant');
const { insertDocuments, findDocuments, updateDocument, removeDocument } = require('./common/mongodbApi');


module.exports = function(router, settings) {
	router.post('/type/addtype', function(req, result) {
		if (!result) {
			return;
		}
		
		const body = req && req.body;
		const selectItmes = body.selectItme;
		const isSelected = body.isSelected;
		const answertype = body.answerType;
		let selectObj = {};
		let params = {};
		const selectArr = [];
		
		
		for (let i = 0, ilen = selectItmes.length; i < ilen; i++) {
			selectObj = {
				isSelected: isSelected[i],
				value: selectItmes[i]
			}
			selectArr.push(selectObj);
		}
		
		if (body.selectType === RADIO || body.selectType === CHECKBOX) {
			params = [{
				selectType: body.selectType,
				answerType: answertype,
				typeName: body.typeName,
				typeNameDis:body.typeNameDis,
				selects: selectArr,
			}];
		} else {
			params = [{
				selectType: body.selectType,
				answerType: answertype,
				typeName: body.typeName,
				question: body.question,
				answer: body.answer,
			}];
		}
		let findWhere = {
			selectType: body.selectType,
			answerType: answertype,
			typeName: body.typeName,
		};
		
		
		findDocuments(findWhere, function(docs) {
			console.log(JSON.stringify(docs) + '111docs');
			if (docs && docs.length === 0) {
				insertDocuments(params, function(res) {
					if (res.result && res.result.ok === 1) {
						console.log('新增数据成功');
					}
				});
			} else {
				console.log('题库重复了');
			}
			result.redirect('/type');
		});
		
		
	});
}