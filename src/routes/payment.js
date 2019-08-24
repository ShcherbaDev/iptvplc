const router = require('express').Router();
const crypto = require('crypto');

const db = require('../database/db');

router.get('/success', (req, res) => {
	if (req.user !== undefined) {
		res.render('index');
	}
	else {
		res.sendStatus(403);
	}
});

router.get('/error', (req, res) => {
	if (req.user !== undefined) {
		res.render('index');
	}
	else {
		res.sendStatus(403);
	}
});

router.post('/process', (req, res) => {
	const data = JSON.parse(JSON.stringify(req.body));
	delete data.ik_sign;

	const dataAsArray = [];

	Object.keys(data).sort().forEach((item, index) => {
		dataAsArray[index] = data[item];
	});

	dataAsArray.push('gR0hqmAfp7GnH6G4');
	const signStr = dataAsArray.join(':');
	const sign = crypto.createHash('md5').update(signStr).digest('base64');

	if (sign !== req.body.ik_sign) {
		throw new Error('Payment error');
	}

	db.query('SELECT * FROM users WHERE id = ?', req.body.ik_x_userid, (findUserErr, val) => {
		if (findUserErr) {
			throw new Error(findUserErr);
		}

		if (val.length === 1) {
			const newUnsubscriptionDate = {
				toSqlString() {
					return `DATE_ADD('${val[0].unsubscription_date}', INTERVAL ${req.body.ik_x_duration} MONTH)`;
				}
			};

			const currentTimestamp = {
				toSqlString() {
					return 'CURRENT_TIMESTAMP()';
				}
			};

			let query = 'UPDATE users SET subscription_date = ?, unsubscription_date = ? WHERE id = ?';
			let queryArgs = [currentTimestamp, newUnsubscriptionDate, req.body.ik_x_userid];

			if (val[0].isDemoMode === 1) {
				query = 'UPDATE users SET subscription_date = ?, unsubscription_date = ?, isDemoMode = ? WHERE id = ?';
				queryArgs = [currentTimestamp, newUnsubscriptionDate, 0, req.body.ik_x_userid];
			}

			console.log(val[0].id, query);

			db.query(query, queryArgs, (err) => {
				if (err) {
					throw new Error(err);
				}
				res.sendStatus(200);
			});
		}
		else {
			throw new Error('Payment error');
		}
	});
});

module.exports = router;
