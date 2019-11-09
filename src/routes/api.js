const router = require('express').Router();
const multiparty = require('multiparty');
const fs = require('fs');
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
	return done(null, user);
});

passport.deserializeUser((user, done) => {
	db.query(`SELECT * FROM users WHERE id='${user.id}'`, (err, queryUser) => {
		return done(err, queryUser);
	});
});

// Login
router.get('/login', (req, res) => {
	if (req.user !== undefined) {
		return res.send({
			isLoggedIn: true,
			...req.user[0]
		});
	}
	
	return res.send({ isLoggedIn: false });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
	if (Object.entries(req.user).length === 0 || req.user === Object) {
		return res.sendStatus(403);
	}
	return res.sendStatus(200);
});

function addPlaylist(fileName, fileMimeType, fileData, userId, res) {
	const CURRENT_TIMESTAMP = { toSqlString: () => 'CURRENT_TIMESTAMP()' };

	const query = 'INSERT INTO `playlists` (filename, mime_type, data, author_id, creation_date, last_edit_date) VALUES (?, ?, ?, ?, ?, ?)';
	const queryArgs = [fileName, fileMimeType, fileData, userId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP];

	return db.query(query, queryArgs, (err, queryResult) => {
		if (err) {
			return res.sendStatus(500);
		}
		return res.status(201).send({ newPlaylistId: queryResult.insertId });
	});
}

function getPlaylistMimeType(fileData) {
	const mimeTypes = process.env.PLAYLIST_ACCEPTABLE_MIME_TYPES.split(', ');
	const regExp = new RegExp(`^data:(${mimeTypes.join('|')});`);
	return fileData.match(regExp)[1] || null;
}

router.post('/upload', (req, res) => {
	const formData = new multiparty.Form();

	return formData.parse(req, (err, fields, files) => {
		if (err) {
			return res.sendStatus(400);
		}

		const { originalFilename, path, headers } = files.file[0];

		if (
			process.env.PLAYLIST_ACCEPTABLE_MIME_TYPES
			.includes(
				headers['content-type']
			)
		) {
			return fs.readFile(path, (readErr, data) => {
				if (readErr) {
					return res.sendStatus(500);
				}

				const fileData = `data:${headers['content-type']};base64,${new Buffer.from(data).toString('base64')}`;
				return addPlaylist(originalFilename, headers['content-type'], fileData, req.user[0].id, res);
			});
		}

		return res.sendStatus(400);
	});
})

router.use((req, res, next) => {
	if (req.headers['content-type'] === 'application/json') {
		next();
	}
	else {
		return res.sendStatus(403);
	}
});

// Logout
router.get('/logout', (req, res) => {
	req.logout();
	return res.redirect('/');
});

// User
router.get('/user/:idOrUsername', (req, res) => {
	const { idOrUsername } = req.params;

	let isNum = parseInt(idOrUsername, 10);
	isNum = !isNaN(idOrUsername);

	const query = isNum
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

		return res.send(playlists);
	});
});

// Playlists
router.get('/playlist/:id', (req, res) => {
	const { id } = req.params;

	const query = 'SELECT * FROM playlists WHERE id = ?';
	db.query(query, id, (err, result) => {
		if (err) {
			return res.sendStatus(500);
		}
		
		const trueRes = {
			...result[0],
			data: Buffer.from(result[0].data, 'base64').toString('utf8')
		};

		return res.send(trueRes);
	});
});

router.post('/createPlaylist', (req, res) => {
	const { user_id, file_name, file_data } = req.body;
	
	const playlistMimeType = getPlaylistMimeType(file_data);
	
	if (playlistMimeType !== null) {
		return addPlaylist(file_name, playlistMimeType, file_data, user_id, res);
	}
	else {
		return res.sendStatus(400);
	}
});

router.put('/renamePlaylist', (req, res) => {
	const { id, newPlaylistName } = req.body;
	const CURRENT_TIMESTAMP = { toSqlString: () => 'CURRENT_TIMESTAMP()' };

	const query = 'UPDATE `playlists` SET filename = ?, last_edit_date = ? WHERE id = ?';
	const queryArgs = [newPlaylistName, CURRENT_TIMESTAMP, id]

	db.query(query, queryArgs, (err) => {
		if (err) {
			return res.sendStatus(500);
		}
		return res.status(200).send({ newPlaylistName });
	});
})

router.post('/deletePlaylist', (req, res) => {
	const { id } = req.body;

	const query = 'DELETE FROM `playlists` WHERE id = ?';

	db.query(query, id, (err) => {
		if (err) {
			return res.sendStatus(500);
		}
		return res.sendStatus(200);
	});
});

router.put('/savePlaylist', (req, res) => {
	const { playlist_id, new_data } = req.body;
	const CURRENT_TIMESTAMP = { toSqlString: () => 'CURRENT_TIMESTAMP()' };

	const query = 'UPDATE `playlists` SET data = ?, last_edit_date = ? WHERE id = ?';
	const queryArgs = [new_data, CURRENT_TIMESTAMP, playlist_id];

	db.query(query, queryArgs, (err) => {
		if (err) {
			return res.sendStatus(500);
		}
		return res.status(200).send(new_data);
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
