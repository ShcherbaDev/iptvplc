const nodemailer = require('nodemailer');

let transporter;

const {
	MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS
} = process.env;

module.exports.create = () => {
	const mailPort = parseInt(MAIL_PORT, 10);

	const mailConfig = {
		host: MAIL_HOST,
		port: mailPort,
		secure: true,
		tls: {
			rejectUnauthorized: false
		},
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASS
		},
		sendmail: process.env.NODE_ENV === 'production'
	};

	transporter = nodemailer.createTransport(mailConfig);
};

module.exports.sendMail = (options, callback) => {
	transporter.sendMail(options, (err, info) => {
		callback(err, info);
	});
};
