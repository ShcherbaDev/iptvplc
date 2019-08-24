const router = require('express').Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const db = require('../database/db');
const mailManager = require('../modules/nodemailer');
const validateCaptcha = require('../modules/validateCaptcha');

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

router.get('/register/success', (req, res) => {
	if (req.user === undefined) {
		res.render('index');
	}
	else {
		res.redirect('/app');
	}
});

router.post('/register', async (req, res) => {
	function registerUser(query, fields) {
		return new Promise((resolve, reject) => {
			db.query(query, fields, (queryErr) => {
				if (queryErr) {
					reject(queryErr);
				}

				resolve(fields);
			});
		});
	}

	function sendEmail(email, userActivationHash) {
		const {
			APP_PROTOCOL, APP_DOMAIN, APP_PORT, MAIL_USER
		} = process.env;
		const appDomain = process.env.NODE_ENV === 'dev' ? `${APP_PROTOCOL}://${APP_DOMAIN}:${APP_PORT}` : `${APP_PROTOCOL}://${APP_DOMAIN}`;

		return mailManager.sendMail({
			from: MAIL_USER,
			to: email,
			subject: 'Подтверждение аккаунта',
			text: `Пожалуйста, подтвердите свой аккаунт по данной ссылке: ${appDomain}/activate/${userActivationHash}\n------------\nС уважением,\nАдминистрация IPTVPLC`
		});
	}

	const {
		registrationLoginField,
		registrationEmailField,
		registrationPasswordField,
		registrationConfirmPasswordField,
		referralUsername,
		captchaResponse
	} = req.body;

	const captchaResponseObject = await validateCaptcha(captchaResponse);

	if (
		registrationLoginField.length >= 4 && !/^\d+$/.test(registrationLoginField.charAt(0)) // Login
		&& /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(registrationEmailField) // Email
		&& registrationPasswordField === registrationConfirmPasswordField // Password
		&& captchaResponseObject.success // Captcha
	) {
		db.query(`SELECT * FROM users WHERE username='${registrationLoginField}'`, (findUserErr, val) => {
			if (findUserErr) {
				throw new Error(findUserErr);
			}

			// If user wasn't found
			if (val.length === 0) {
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

						const CURRENT_TIMESTAMP = { toSqlString: () => 'CURRENT_TIMESTAMP()' };
						const DEMO_TIME = { toSqlString: () => 'DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 3 DAY)' };
						const USER_IP = { toSqlString: () => `INET_ATON('${req.connection.remoteAddress}')` };

						const queryArgs = [registrationLoginField, userPassword, registrationEmailField, USER_IP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DEMO_TIME, userActivationHash];

						let referralId;
						if (referralUsername !== undefined) {
							db.query('SELECT `id` FROM `users` WHERE `username` = ?', referralUsername, (referralError, referralData) => {
								if (referralError) {
									throw new Error(referralError);
								}
								referralId = referralData[0].id;

								queryArgs.push(referralId);

								registerUser(
									'INSERT INTO `users` (username, password, email, ip, registration_date, subscription_date, unsubscription_date, activation_hash, referralId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
									queryArgs
								).then(() => sendEmail(registrationEmailField, userActivationHash));
							});
						}
						else {
							registerUser(
								'INSERT INTO `users` (username, password, email, ip, registration_date, subscription_date, unsubscription_date, activation_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
								queryArgs
							).then(() => sendEmail(registrationEmailField, userActivationHash));
						}

						res.redirect(307, '/register/success');
					});
				});
			}
			else {
				res.render('index');
			}
		});
	}
	else {
		res.render('index');
	}
});

router.get('/activate/:hash', (req, res) => {
	function loginUser(userData) {
		req.login(userData, (loginErr) => {
			if (loginErr) {
				throw new Error(loginErr);
			}

			res.redirect('/app');
		});
	}

	db.query(`SELECT * FROM users WHERE activation_hash = '${req.params.hash}'`, (err, val) => {
		if (err) {
			throw new Error(err);
		}

		if (val.length > 0 && val[0].active === 0) {
			db.query(`UPDATE users SET active = 1 WHERE activation_hash = '${req.params.hash}'`, (error) => {
				if (error) {
					throw new Error(error);
				}

				// Если пользователь зарегистрировался через реферальную ссылку - добавить реферу 1 день подписки
				if (val[0].referralId !== null) {
					db.query(`SELECT id, active FROM users WHERE referralId = ${val[0].referralId}`, (referralErr, users) => {
						if (referralErr) {
							throw new Error(referralErr);
						}

						let activeUsersCount = 0;
						users.forEach((user) => {
							if (user.active === 1) {
								activeUsersCount += 1;
							}
						});

						if (activeUsersCount > 0 && activeUsersCount % 5 === 0) {
							db.query(`UPDATE \`users\` SET \`unsubscription_date\` = DATE_ADD(unsubscription_date, INTERVAL 1 MONTH) WHERE \`id\` = ${val[0].referralId}`, (updateErr) => {
								if (updateErr) {
									throw new Error(updateErr);
								}
								loginUser(val[0]);
							});
						}
					});
				}
				else {
					loginUser(val[0]);
				}
			});
		}
	});
});

router.get('/user/:username', (req, res) => {
	if (req.user !== undefined && req.user[0].username === req.params.username) {
		res.render('index');
	}
	else {
		res.redirect('/');
	}
});

router.get('/admin', (req, res) => {
	if (process.env.NODE_ENV === 'dev'
		|| (
			process.env.NODE_ENV !== 'dev'
			&& req.user !== undefined
			&& req.user[0].isAdmin === 1
		)) {
		res.render('index');
	}
	else {
		res.sendStatus(403);
	}

	// if (process.env.NODE_ENV === 'dev') {
	// 	res.render('index');
	// }
	// else {
	// 	if (req.user !== undefined && req.user[0].isAdmin === 1) {
	// 		res.render('index');
	// 	}
	// 	else {
	// 		res.sendStatus(403);
	// 	}
	// }
});

router.get('/referral/:username', (req, res) => {
	if (req.user !== undefined) {
		res.redirect('/app');
	}
	else {
		db.query(`SELECT username FROM users WHERE username = '${req.params.username}'`, (err, val) => {
			if (err) {
				throw new Error(err);
			}

			if (val[0] !== undefined) {
				res.cookie('referral', val[0].username);
			}
			res.redirect('/');
		});
	}
});

module.exports = router;
