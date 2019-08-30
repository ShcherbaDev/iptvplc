const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mailManager = require('../modules/nodemailer');
const validateCaptcha = require('../modules/validateCaptcha');

const db = require('../database/db');

passport.use(new LocalStrategy((username, password, done) => {
	db.query(`SELECT * FROM users WHERE username='${username}'`, async (err, user) => {
		if (err) {
			return done(err);
		}
		if (user[0] === undefined || !await bcrypt.compare(password, user[0].password)) {
			return done(null, false);
		}
		return done(null, user[0]);
	});
}));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	db.query(`SELECT * FROM users WHERE id='${user.id}'`, (err, queryUser) => {
		done(err, queryUser);
	});
});

router.use((req, res, next) => {
	res.set('Content-Type', 'application/json');
	next();
});

// Login
router.get('/login', (req, res) => {
	if (req.user !== undefined) {
		res.send({
			isLoggedIn: true,
			...req.user[0]
		});
	}
	else {
		res.send({ isLoggedIn: false });
	}
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/app',
	failureRedirect: '/login'
}), (req, res) => {
	res.redirect(`/user/${req.user.username}`);
});

/**
 * Middleware for checking, if user is entering to api page via browser.
 * If it is - return 403 HTTP status, else - pass middleware.
 */
router.use((req, res, next) => {
	if (req.headers['content-type'] === 'application/json') {
		next();
	}
	else {
		res.sendStatus(403);
	}
});

// Logout
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// User
router.get('/user/:idOrUsername', (req, res) => {
	const { idOrUsername } = req.params;

	let isNum = parseInt(idOrUsername, 10);
	isNum = !isNaN(idOrUsername);

	const query = 
		isNum
		? `SELECT * FROM users WHERE id='${idOrUsername}'`
		: `SELECT * FROM users WHERE username='${idOrUsername}'`;

	db.query(query, (err, value) => {
		if (err) {
			throw new Error(err);
		}

		// If user is exist - set as database output, else - set as empty object
		const jsonOutput = (value.length > 0) ? value[0] : {};

		res.send(jsonOutput);
	});
});

router.get('/user/:id/playlists', (req, res) => {
	const { id } = req.params;
	
	const query = `SELECT * FROM playlists WHERE author_id='${id}'`;

	db.query(query, (err, playlists) => {
		if (err) {
			throw new Error(err);
		}

		res.send(playlists);
	});
});

// Playlists
router.get('/playlist/:id', (req, res) => {
	const { id } = req.params;

	const query = `SELECT * FROM playlists WHERE id='${id}'`;

	db.query(query, (err, result) => {
		if (err) {
			console.error(`${err}\n---\nInput data:\nPlaylist id: ${id}`);
			res.sendStatus(500);
		}

		const trueRes = {
			...result[0],
			data: Buffer.from(result[0].data, 'base64').toString('utf8')
		};

		res.send(trueRes);
	});
});

router.post('/createPlaylist', (req, res) => {
	const { user_id, filename, filedata } = req.body;

	if (filedata.startsWith('data:audio/x-mpegurl;')) {
		const query = 'INSERT INTO `playlists` (filename, data, author_id) VALUES (?, ?, ?)';
		const queryArgs = [filename, filedata, user_id];

		db.query(query, queryArgs, (err, queryResult) => {
			if (err) {
				console.error(`${err}\n---\nInput data:\nUser id: ${user_id}\nFile name: ${filename}\nFile data: ${filedata.slice(0, 50)}...`);
				res.sendStatus(500);
			}
			res.status(201).send({ newPlaylistId: queryResult.insertId });
		});
	}
	else {
		res.sendStatus(400)
	}
});

router.post('/deletePlaylist', (req, res) => {
	const { id } = req.body;

	const query = 'DELETE FROM `playlists` WHERE id = ?';
	
	db.query(query, id, err => {
		if (err) {
			console.log(`${err}\n---\nInput data:\nPlaylist id: ${id}`);
			res.sendStatus(500);
		}
		res.sendStatus(200);
	});
});

router.post('/savePlaylist', (req, res) => {
	const { playlist_id, new_data } = req.body;
	const CURRENT_TIMESTAMP = { toSqlString: () => 'CURRENT_TIMESTAMP()' }

	const query = 'UPDATE `playlists` SET data = ?, last_edit_date = ? WHERE id = ?';
	const queryArgs = [new_data, CURRENT_TIMESTAMP, playlist_id];

	db.query(query, queryArgs, err => {
		if (err) {
			console.log(`${err}\n---\nInput data:\nPlaylist id: ${playlist_id}\nIs new playlist data empty: ${new_data.length < 1}`);
			res.sendStatus(500);
		}
		res.status(200).send(new_data);
	});
});

// Mail
router.post('/sendMail', async (req, res) => {
	const {
		name, email, message, pageFrom
	} = req.body;
	const subjectText = pageFrom === '/' 
		? `${name} (${email}) отправил(-а) сообщение через форму обратной связи на главной странице`
		: `Пользователь ${name} (${email}) отправил(-а) сообщение`;

	function sendMail() {
		return new Promise((resolve, reject) => {
			const { MAIL_USER } = process.env;

			mailManager.sendMail({
				from: MAIL_USER,
				to: MAIL_USER,
				subject: subjectText,
				text: message
			}, (err) => {
				if (err) {
					reject(err);
				}
				resolve();
			});
		});
	}

	if (pageFrom === '/') {
		const captchaResponseObject = await validateCaptcha(req.body.captchaResponse);

		if (captchaResponseObject.success) {
			return sendMail().then(() => res.sendStatus(200)).catch(() => res.sendStatus(500));
		}
		return new Promise(reject => reject(captchaResponseObject));
	}
	return sendMail().then(() => res.sendStatus(200)).catch(() => res.sendStatus(500));
});

module.exports = router;
