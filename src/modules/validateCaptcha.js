const fetch = require('node-fetch').default;

const validateCaptcha = async (captchaResponse) => {
	const request = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captchaResponse}`, {
		method: 'POST'
	});
	const response = await request.json();
	return response;
};

module.exports = validateCaptcha;
