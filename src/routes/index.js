const router = require('express').Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const db = require('database/db');
const mailManager = require('modules/nodemailer');
const validateCaptcha = require('modules/validateCaptcha');

router.get('/', (req, res) => {
	if (req.user === undefined) {
		return res.render('index');
	}

	return res.redirect('/app');
});

router.get('/app', (req, res) => {
	if (req.user !== undefined) {
		return res.render('index');
	}

	return res.redirect('/');
});

router.get('/login', (req, res) => {
	if (req.user === undefined) {
		return res.render('index');
	}

	return res.redirect('/app');
});

router.get('/register', (req, res) => res.render('index'));

router.get('/register/success', (req, res) => {
	if (req.user === undefined) {
		return res.render('index');
	}

	return res.redirect('/app');
});

router.post('/register', async (req, res) => {
	const {
		registrationLoginField,
		registrationEmailField,
		registrationPasswordField,
		registrationConfirmPasswordField,
		captchaResponse
	} = req.body;

	const captchaResponseObject = await validateCaptcha(captchaResponse);

	if (
		registrationLoginField.length >= 4 && !/[а-яёіїґ]/gi.test(registrationLoginField) // Login
		&& /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(registrationEmailField) // Email
		&& registrationPasswordField === registrationConfirmPasswordField // Password
		&& captchaResponseObject.success // Captcha
	) {
		db.query('SELECT * FROM users WHERE username = ?', [registrationLoginField], (findUserErr, val) => {
			if (findUserErr) {
				return res.sendStatus(500);
			}

			// If user wasn't found
			if (val.length === 0) {
				bcrypt.genSalt(10, (err, salt) => {
					if (err) {
						return res.sendStatus(500);
					}

					bcrypt.hash(registrationPasswordField, salt, (error, hash) => {
						if (error) {
							return res.sendStatus(500);
						}

						const userPassword = hash;
						const userActivationHash = crypto.randomBytes(20).toString('hex');

						const CURRENT_TIMESTAMP = { toSqlString: () => 'CURRENT_TIMESTAMP()' };

						const query = 'INSERT INTO `users` (username, password, email, registration_date, activation_hash) VALUES (?, ?, ?, ?, ?)';
						const queryArgs = [registrationLoginField, userPassword, registrationEmailField, CURRENT_TIMESTAMP, userActivationHash];

						db.query(query, queryArgs, (queryErr) => {
							if (queryErr) {
								return res.sendStatus(500);
							}

							const {
								APP_PROTOCOL, APP_DOMAIN, APP_PORT, MAIL_USER
							} = process.env;
							const appDomain = process.env.NODE_ENV === 'development' ? `${APP_PROTOCOL}://${APP_DOMAIN}:${APP_PORT}` : `${APP_PROTOCOL}://${APP_DOMAIN}`;

							mailManager.sendMail({
								from: MAIL_USER,
								to: registrationEmailField,
								subject: 'Подтверждение аккаунта',
								text: `Пожалуйста, подтвердите свой аккаунт по данной ссылке: ${appDomain}/activate/${userActivationHash}\n------------\nС уважением,\nАдминистрация IPTVPLC`
							}, () => res.sendStatus(201));
						});
					});
				});
			}
			else {
				return res.sendStatus(403);
			}
		});
	}
	else {
		return res.sendStatus(403);
	}
});

router.get('/activate/:hash', (req, res) => {
	db.query('SELECT * FROM users WHERE activation_hash = ?', [req.params.hash], (err, val) => {
		if (val.length > 0 && val[0].active === 0) {
			db.query('UPDATE users SET active = 1 WHERE activation_hash = ?', [req.params.hash], (error) => {
				if (error) {
					return res.sendStatus(500);
				}

				req.login(val[0], (loginErr) => {
					if (loginErr) {
						return res.sendStatus(500);
					}

					return res.redirect('/app');
				});
			});
		}
		else {
			return res.sendStatus(500);
		}
	});
});

module.exports = router;
