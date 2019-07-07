import React, { Component } from 'react';

class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};
	}

	setLogin(event) {
		this.setState({
			username: event.target.value
		});
	}

	setPassword(event) {
		this.setState({
			password: event.target.value
		});
	}

	render() {
		return (
			<form method="POST" action="/api/login">
				<div className="form-group">
					<label htmlFor="login">Логин:</label>
					<input type="text" className="form-control" id="login" name="username" onChange={this.setLogin.bind(this)} />
				</div>
				<div className="form-group">
					<label htmlFor="password">Пароль:</label>
					<input type="password" className="form-control" id="password" name="password" onChange={this.setPassword.bind(this)} />
				</div>
				<button className="btn btn-outline-success btn-block">Войти</button>

				<div className="additional-buttons">
					<a href="/register">Зарегистрироватся</a>
				</div>
			</form>
		);
	}
}

export default LoginForm;
