const mysql = require('mysql');

const connection = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'iptv_constructor_test',
	dateStrings: true
});

connection.getConnection((err) => {
	if (err) {
		throw new Error(err);
	}

	console.log('Database connected!');
});

module.exports = connection;
