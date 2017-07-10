const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nconf = require('nconf');
const winston = require('winston');
const cors = require('cors');
const http = require('http');
const WebSocket = require('uws');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const onMessage = (message) => {
  wss.broadcast(message);
};

wss.on('connection', (ws) => {
  ws.on('message', onMessage);
});

server.listen(8080, () => {
  console.log(`Listening on ${server.address().port}`);
});

const env = (process.env.NODE_ENV !== undefined) ? process.env.NODE_ENV.trim() : 'development';

nconf.argv()
   .env()
   .file({ file: `${__dirname}/config.${env}.json` });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes
const appRoutes = nconf.get('routes');
appRoutes.map((item) => {
  app.use(item.url, require(`${__dirname}/${item.file}`));
  winston.log('info', 'Loaded route', item);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
