const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const passport = require('passport');

const app = express();

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const playlistRouter = require('./routes/playlist');

const mailManager = require('./modules/nodemailer');

const port = process.env.APP_PORT || 3000;

app.enable('trust proxy');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser('SECRET'));
app.use(session({
	secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(indexRouter);
app.use('/api', apiRouter);
app.use('/playlist', playlistRouter);

app.use(express.static('dist'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', path.join(__dirname));
app.set('view options', {
	layout: false
});

mailManager.create();

app.listen(port, () => {
	console.log(`App listening on port ${port}\nPress Ctrl+C to quit.`);
});
