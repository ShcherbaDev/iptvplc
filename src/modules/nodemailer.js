const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'smtp.ukr.net',
	port: 2525,
	secure: true,
	tls: {
		rejectUnauthorized: false
	},
	auth: {
		user: 'andrey_shcherba@ukr.net',
		pass: 'XqVAL6YgcweVIZQo'
	}
});

module.exports = transporter;
