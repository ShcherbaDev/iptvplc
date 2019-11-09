import React, { Component, Fragment } from 'react';

class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			isIncorrect: false
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

	submitForm(e) {
		e.preventDefault();

		fetch(`${window.location.origin}/api/login`, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}),
			body: JSON.stringify({ username: this.state.username, password: this.state.password })
		}).then(res => {
			switch (res.status) {
				case 200:
					window.location.href = `${window.location.origin}/app`;
					break;
			
				default:
					this.setState({ isIncorrect: true });
					break;
			}
		});
	}

	render() {
		return (
			<Fragment>
				{this.state.isIncorrect && (
					<div className="alert alert-danger">
						Неверное имя пользователя или пароль!
					</div>
				)}

				<form method="POST" action="#">
					<div className="form-group">
						<label htmlFor="login">Логин:</label>
						<input type="text" className="form-control" id="login" name="username" onChange={this.setLogin.bind(this)} />
					</div>
					<div className="form-group">
						<label htmlFor="password">Пароль:</label>
						<input type="password" className="form-control" id="password" name="password" onChange={this.setPassword.bind(this)} />
					</div>
					<button className="btn btn-outline-success btn-block" onClick={this.submitForm.bind(this)}>Войти</button>

					<div className="additional-buttons">
						<a href="/register">Зарегистрироватся</a>
					</div>
				</form>
			</Fragment>
		);
	}
}

export default LoginForm;
