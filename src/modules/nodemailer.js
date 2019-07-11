const nodemailer = require('nodemailer');

let transporter;

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

module.exports.create = () => {
	transporter = nodemailer.createTransport({
		host: MAIL_HOST,
		port: MAIL_PORT,
		secure: true,
		tls: {
			rejectUnauthorized: false
		},
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASS
		}
	});
};

module.exports.sendMail = (options, callback) => {
	transporter.sendMail(options, callback);
};
