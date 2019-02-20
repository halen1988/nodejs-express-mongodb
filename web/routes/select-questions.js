/**
 * Created by admin on 2018/7/17.
 */
const { QUESTIONTYPE, SELECTTYPE} = require('./common/constant');


module.exports = function (router, settings) {
	router.get('/select-questions', function (req, res) {
		res.render('select-questions.html', {
			'typeArr':QUESTIONTYPE,
			'typeArr2':SELECTTYPE
		});
	});
}