const nodemailer = require('nodemailer');

let transporter;

const {
	MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS
} = process.env;

module.exports.create = () => {
	let mailConfig = {
		host: MAIL_HOST,
		port: parseInt(MAIL_PORT, 10),
		secure: true,
		tls: {
			rejectUnauthorized: false
		},
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASS
		}
	};

	if (MAIL_HOST === 'smtp.gmail.com') {
		mailConfig = {
			// host: MAIL_HOST,
			// port: parseInt(MAIL_PORT, 10),
			// secure: false,
			// tls: {
			// 	ciphers: 'SSLv3'
			// },
			// requireTLS: true,
			service: 'Gmail',
			auth: {
				user: MAIL_USER,
				pass: MAIL_PASS
			}
		};
	}

	transporter = nodemailer.createTransport(mailConfig);
};

module.exports.sendMail = (options) => {
	transporter.sendMail(options, (err, info) => {
		if (err) {
			console.error(err);
		}
		console.log(info);
	});
};
