/**
 * Created by admin on 2018/8/31.
 */
/**
 * Created by admin on 2018/7/18.
 */

const { RADIO, CHECKBOX } = require('./common/constant');
const { insertDocuments, findDocuments, updateDocument, removeDocument } = require('./common/mongodbApi');


module.exports = function(router, settings) {
	router.post('/answer/answer-form', function(req, res) {
		if (!res) {
			return;
		}
		const findData = async (i) => {
			return new Promise((resolve, reject) => {
				findDocuments({
					_id : i
				}, (data) => {
					resolve(data);
				});
			});
		}
		
		const body = req && req.body;
		const questionList = [];
		
		const findnew = async (body) => {
			for(let i in body){
				const item = i.split('_');
				// const selectType = item[0];
				// const answerType = item[1];
				const index = i.indexOf('_') >= 0 ? item[2] : i;
				const value = body[i];
			
			const data = await findData(index).then((data) => {
				return data;
			});
			
			
			const rightQuestion = data[0];
			const selects = rightQuestion.selects || [];
			
				rightQuestion.selectValue = [];
				
				for(let i=0; i < selects.length; i++){
					const item = selects[i];
					
					const fileterValue = typeof value === 'object' && value.filter(function(value){
						return item.value === value;
					});
					
					const isRight = (fileterValue && fileterValue.length > 0 || item.value === value) && item.isSelected === 'true';
					
					rightQuestion.selectValue.push(value);
					
							if(isRight){
								if(rightQuestion.selectType === RADIO){
									rightQuestion.isRight = isRight;
									break;
								}else if(rightQuestion.selectType === CHECKBOX){
										rightQuestion.isRight = isRight;
								}
							}
				}
				
				rightQuestion.selectValue = Array.from(new Set(rightQuestion.selectValue));
				
				questionList.push(rightQuestion);
		}
		
			//计算得分
			let radio = 0, checkbox = 0, answer = 0, radioRight = 0, checkboxRight = 0, answerRight = 0;
			for(let i=0; i<questionList.length; i++){
				const item = questionList[i];
				const isRight = item.isRight;
				const selectType = item.selectType;
				
				if(selectType === RADIO){
					radio = radio+1;
					if(isRight){
						radioRight = radioRight+1;
					}
				}else if(selectType === CHECKBOX){
					checkbox = checkbox+1;
					if(isRight){
						checkboxRight = checkboxRight+1;
					}
				}else {
					answer = answer+1;
					if(isRight){
						answerRight = answerRight+1;
					}
				}
			}
			
			const scoreTotal = ((30 / radio) * radioRight)+((30 / checkbox) * checkboxRight)+((40 / answer) * answerRight);
			
			res.render('answer-form.html', {
				findListArr: questionList,
				score: scoreTotal || '',
			});
		};
		findnew(body);
		
	});
}