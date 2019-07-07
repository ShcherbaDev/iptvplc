const router = require('express').Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const db = require('../database/db');
const nodemailer = require('../modules/nodemailer');

router.get('/', (req, res) => {
		res.render('index');
});

router.get('/app', (req, res) => {
	res.render('index');
});

router.get('/login', (req, res) => {
	res.render('index');
});

router.get('/register', (req, res) => {
	res.render('index');
});

router.post('/register', (req, res) => {
	const {
		registrationLoginField,
		registrationEmailField,
		registrationPasswordField,
		registrationConfirmPasswordField
	} = req.body;

	db.query(`SELECT * FROM users WHERE username='${registrationLoginField}'`, (findUserErr, val) => {
		if (findUserErr) {
			throw new Error(findUserErr);
		}

		// If user wasn't found
		if (val.length === 0) {
			if (
				registrationLoginField.length >= 4 && !/^\d+$/.test(registrationLoginField.charAt(0)) // Login
				&& /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(registrationEmailField) // Email
				&& registrationPasswordField === registrationConfirmPasswordField // Password
			) {
				bcrypt.genSalt(10, (err, salt) => {
					if (err) {
						throw new Error(err);
					}

					bcrypt.hash(registrationPasswordField, salt, (error, hash) => {
						if (error) {
							throw new Error(error);
						}

						const userPassword = hash;
						const userActivationHash = crypto.randomBytes(20).toString('hex');

						const newUserQuery = 'INSERT INTO `users` (username, password, email, ip, registration_date, subscription_date, unsubscription_date, activation_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
						const CURRENT_TIMESTAMP = { toSqlString: () => 'CURRENT_TIMESTAMP()' };
						const NEXT_YEAR = { toSqlString: () => 'DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 3 DAY)' };
						const USER_IP = { toSqlString: () => `INET_ATON('${req.connection.remoteAddress}')` };

						db.query(newUserQuery, [registrationLoginField, userPassword, registrationEmailField, USER_IP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NEXT_YEAR, userActivationHash], ((queryErr) => {
							if (queryErr) {
								throw new Error(queryErr);
							}

							nodemailer.sendMail({
								from: 'andrey_shcherba@ukr.net',
								to: registrationEmailField,
								subject: 'Подтверждение аккаунта',
								text: `Пожалуйста, подтвердите свой аккаунт по данной ссылке: http://localhost:3000/activate/${userActivationHash}\n------------\nС уважением,\nАдминистрация сайта http://localhost:3000`
							});

							res.redirect('/app');
						}));
					});
				});
			}
		}
		else {
			res.render('index');
		}
	});
});

router.get('/activate/:hash', (req, res) => {
	db.query(`SELECT * FROM users WHERE activation_hash = '${req.params.hash}'`, (err, val) => {
		if (err) {
			throw new Error(err);
		}

		if (val.length > 0 && val[0].active === 0) {
			db.query(`UPDATE users SET active = 1 WHERE activation_hash = '${req.params.hash}'`, (error) => {
				if (error) {
					throw new Error(error);
				}

				req.login(val[0], (loginErr) => {
					if (loginErr) {
						throw new Error(loginErr);
					}

					res.redirect('/app');
				});
			});
		}
		else {
			res.redirect('/');
		}
	});
});

router.get('/user/:idOrUsername', (req, res) => {
	res.render('index');
});

router.get('/admin', (req, res) => {
	res.render('index');
	// if (req.user !== undefined && req.user[0].isAdmin === 1) {
	// 	res.render('index');
	// }
	// else {
	// 	res.sendStatus(403);
	// }
});

module.exports = router;
