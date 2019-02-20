

module.exports = function (router, settings) {
	router.get('/', function (req, res) {
		res.render('index.html',{
			'time':new Date(),
			'project_name' : settings['project_name']
		});
	});
}