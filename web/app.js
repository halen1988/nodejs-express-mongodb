//referance: http://expressjs.com/guide/migrating-4.html
const chalk = require('chalk');

class webapp {
    constructor(settings) {
        this.settings = settings;
    }

    start() {
        let self = this;
        let express = require('express');
        let http = require('http');
        let path = require('path');
        let fs = require('fs');

        let favicon = require('serve-favicon');
        let morgan = require('morgan');
        let methodOverride = require('method-override');
        let bodyParser = require('body-parser');
        let cookieParser = require('cookie-parser');
        let multer = require('multer');
        let errorHandler = require('errorhandler');

        let app = express();
        let port = self.settings['port'] || process.env.PORT;

        //all environments

        //views
        app.set('views', path.join(__dirname, 'views'));

        //engine
        app.engine('.html', require('ejs').renderFile);
        app.set('view engine', 'html');

        //json callback
        app.set('jsonp callback', true);

        //website favicon
        app.use(favicon(__dirname + '/public/favicon.ico'));

        //log settings
        let accessLogfile = fs.createWriteStream('logs/access.log', {
            flags: 'a'
        });

        app.use(morgan('combined', {
            skip: function(req, res) {
                return res.statusCode < 400
            },
            stream: accessLogfile
        }));

        app.use(methodOverride());
        app.use(bodyParser.json({'limit' : '10mb'}));
        app.use(bodyParser.urlencoded({
            'extended': true,
            'limit' : '10mb'
        }));
        app.use(cookieParser(self.settings['session_secret']));
        app.use(express.static(path.join(__dirname, 'public')));

        //default routes//////////////////////////
        let router = express.Router();
        require('./routes/index.js')(router, self.settings);
        app.use(router);

        // error handling middlewares should be loaded after the loading the routes
        let errorLogfile = fs.createWriteStream('logs/error.log', {
            flags: 'a'
        });
        app.use(errorHandler({
            log: function(err, str, req) {
                let meta = '[' + new Date() + '] ' + req.url + '\n';
                errorLogfile.write(meta + err.stack + '\n');
            }
        }));
        
        
        
        //异步处理
          const methods = [ 'get', 'post', 'put', 'delete' ];
      
          for (let method of methods) {
            app[method] = function (...data) {
              if (method === 'get' && data.length === 1) return app.set(data[0]);
              const params = [];
              for (let item of data) {
                if (Object.prototype.toString.call(item) !== '[object AsyncFunction]') {
                  params.push(item);
                  continue;
                }
                const handle = function (...data) {
                  const [ req, res, next ] = data;
                  item(req, res, next).then(next).catch(next);
                };
                params.push(handle);
              }
              router[method](...params);
            };
          }
        
        

        let server = require('http').createServer(app);
        require('./socket.io.handle.js').runServer(server, self.settings); //socket io integrated
        server.listen(port, function() {
            console.log('Feadmin-web start, starttime:' + new Date().toString() + chalk.green.bold('Express server listening on port ' + port));
        });
    }

}





if (module.parent) {
    module.exports = webapp;
} else {
    process.env.profile = process.env.profile || 'dev';
    let settings = require('../settings-' + process.env.profile + '.json');
    settings['port'] = settings['server_port'];
    new webapp(settings).start();
}