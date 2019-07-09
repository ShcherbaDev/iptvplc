const fetch = require('node-fetch').default;

const validateCaptcha = async (captchaResponse) => {
	const request = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=6Ldcl6wUAAAAAND6wQ7_45gkq--voxL3JnvKEvjk&response=${captchaResponse}`, {
		method: 'POST'
	});
	const response = await request.json();
	return response;
}

module.exports = validateCaptcha;
