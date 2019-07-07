const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

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

// Login
router.get('/login', (req, res) => {
	if (req.user !== undefined) {
		res.json({
			isLoggedIn: true,
			...req.user[0]
		});
	}
	else {
		res.json({ isLoggedIn: false });
	}
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/app',
	failureRedirect: '/login',
	failureFlash: 'Invalid username or password.'
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

	const query = isNum ? `SELECT * FROM users WHERE id='${idOrUsername}'` : `SELECT * FROM users WHERE username='${idOrUsername}'`;

	db.query(query, (err, value) => {
		if (err) {
			throw new Error(err);
		}

		// If user is exist - set as database output, else - set as empty object
		const jsonOutput = (value.length > 0) ? value[0] : {};

		res.json(jsonOutput);
	});
});

module.exports = router;
