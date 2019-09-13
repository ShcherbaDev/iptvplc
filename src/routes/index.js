const router = require('express').Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const db = require('../database/db');
const mailManager = require('../modules/nodemailer');
const validateCaptcha = require('../modules/validateCaptcha');

router.get('/', (req, res) => {
	if (req.user === undefined) {
		res.render('index');
	}
	else {
		res.redirect('/app');
	}
});

router.get('/app', (req, res) => {
	if (req.user !== undefined) {
		res.render('index');
	}
	else {
		res.redirect('/');
	}
});

router.get('/login', (req, res) => {
	if (req.user === undefined) {
		res.render('index');
	}
	else {
		res.redirect('/app');
	}
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

						const queryArgs = [registrationLoginField, userPassword, registrationEmailField, CURRENT_TIMESTAMP, userActivationHash];

						registerUser(
							'INSERT INTO `users` (username, password, email, registration_date, activation_hash) VALUES (?, ?, ?, ?, ?)',
							queryArgs
						).then(() => sendEmail(registrationEmailField, userActivationHash));

						res.redirect(201, '/register/success');
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

				loginUser(val[0]);
			});
		}
	});
});

module.exports = router;
