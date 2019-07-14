const mysql = require('mysql');

const {
	DB_HOST, DB_DATABASE, DB_USER, DB_PASS
} = process.env;

const connection = mysql.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASS,
	database: DB_DATABASE,
	dateStrings: true
});

connection.getConnection((err) => {
	if (err) {
		throw new Error(err);
	}

	console.log('Database connected!');
});

module.exports = connection;
