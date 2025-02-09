const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const passport = require('passport');

const app = express();

const indexRouter = require('routes/index');
const apiRouter = require('routes/api');

const mailManager = require('modules/nodemailer');

const port = process.env.APP_PORT || 3000;

app.enable('trust proxy');

app.use(cors());

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use(cookieParser('SECRET'));
app.use(session({
	secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(indexRouter);
app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'development') {
	app.use(express.static('dist'));
}
else {
	app.use('/static', express.static(`${__dirname}/static`));
}

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', path.join(__dirname));
app.set('view options', {
	layout: false
});

mailManager.create();

app.listen(port);
