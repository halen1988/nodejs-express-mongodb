/**
 * Created by admin on 2018/7/17.
 */
const { QUESTIONTYPE, SELECTTYPE} = require('./common/constant');


module.exports = function (router, settings) {
	router.get('/type', function (req, res) {
		res.render('type.html', {
			'typeArr':QUESTIONTYPE,
			'typeArr2':SELECTTYPE
		});
	});
}