/**
 * Created by cherokee on 15-4-2.
 */

module.exports = function (router, settings) {
  require('./demo.js')(router, settings);
	require('./type.js')(router, settings);
	require('./addType.js')(router, settings);
	require('./select-questions.js')(router, settings);
	require('./select-form.js')(router, settings);
	require('./answer-form.js')(router, settings);
	require('./select-question-list.js')(router, settings);
}

