const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'smtp.ukr.net',
	port: 2525,
	secure: true,
	tls: {
		rejectUnauthorized: false
	},
	auth: {
		// TODO: потом поменять
		user: 'iptvplc@gmail.com',
		pass: 'GyNzmtWSJJBVQpTY'
	}
});

module.exports = transporter;
