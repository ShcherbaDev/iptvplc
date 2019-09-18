import React, { Component } from 'react';
import Card from '../../../components/Card/Card';

import fetchApi from '../../../assets/js/fetchApi';

class RegistrationSubpage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isInvalid: false,

			login: '',
			isLoginValid: false,
			loginError: 'Логин должен быть написан латиницей, хотя бы 4 символа в длину.',

			email: '',
			isEmailValid: false,

			password: '',
			isPasswordValid: false,

			repeatedPassword: ''
		};
	}

	validateLogin(event) {
		const targetValue = event.target.value;

		const isLoginValid = targetValue.length >= 4 && !/^\d+$/.test(targetValue.charAt(0));

		this.setState({
			login: targetValue,
			isLoginValid
		});
	}

	validateEmail(event) {
		const targetValue = event.target.value;

		const isEmailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(targetValue);

		this.setState({
			email: targetValue,
			isEmailValid
		});
	}

	validatePassword(event) {
		const targetValue = event.target.value;

		const isPasswordValid = targetValue.length >= 6;

		this.setState({
			password: targetValue,
			isPasswordValid
		});
	}

	validateRepeatedPassword(event) {
		const targetValue = event.target.value;

		this.setState({
			repeatedPassword: targetValue,
		});
	}

	getCookie(name) {
		let cookie = {};
		document.cookie.split(';').forEach((e) => {
			let [key, value] = e.split('=');
			cookie[key.trim()] = value;
		});
		return cookie[name] || null;
	}

	submitForm(event) {
		event.preventDefault();

		fetchApi(`user/${this.state.login}`)
			.then(async (data) => {
				const isEmpty = () => {
					for (let key in data) {
						if (data.hasOwnProperty(key)) {
							return false;
						}
					}
					return true;
				}

				// If user with typed login that isn't exist
				if (isEmpty()) {
					const submitObj = {
						registrationLoginField: this.state.login,
						registrationEmailField: this.state.email,
						registrationPasswordField: this.state.password,
						registrationConfirmPasswordField: this.state.repeatedPassword,
						captchaResponse: grecaptcha.getResponse()
					};

					const referralUsername = this.getCookie('referral');

					if (referralUsername !== null) {
						submitObj.referralUsername = referralUsername;
					}

					fetch('/register', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json'
						},
						body: JSON.stringify(submitObj)
					})
						.then(res => {
							switch (res.status) {
								case 201:
									window.location.href = `${window.location.origin}/register/success`;
									break;
							
								default:
									this.setState({ isInvalid: true });
									break;
							}
							
						});
				}
				else {
					this.setState({
						loginError: `Пользователь с именем "${this.state.login}" уже существует!`,
						isLoginValid: false
					});
				}
			});
	}

	render() {
		const cardFooter = <button className="btn btn-block btn-outline-success" onClick={(event) => this.submitForm(event)} disabled={!this.state.isLoginValid || !this.state.isEmailValid || !this.state.isPasswordValid || this.state.password !== this.state.repeatedPassword}>Зарегистрироватся</button>;

		return (
			<Card title="Регистрация" footer={cardFooter} className={this.props.currentTab === 'registration' ? 'active' : 'unactive'}>
				<div className="alert alert-danger">
					Форма регистрации была не правильно заполнена!
				</div>

				<form action="/register" method="POST" noValidate>
					<div className={`form-group${this.state.isLoginValid ? '' : ' invalid'}`}>
						<label htmlFor="registrationLoginField">Логин:</label>
						<input type="text" className="form-control" id="registrationLoginField" name="registrationLoginField" required onChange={this.validateLogin.bind(this)} />
						
						<div className="invalid-feedback">
							{this.state.loginError}
						</div>
					</div>
					<div className={`form-group${this.state.isEmailValid ? '' : ' invalid'}`}>
						<label htmlFor="registrationEmailField">Email:</label>
						<input type="email" className="form-control" id="registrationEmailField" name="registrationEmailField" required onChange={this.validateEmail.bind(this)} />
					
						<div className="invalid-feedback">
							Неверный формат электронной почты.
						</div>
					</div>
					<div className={`form-group${this.state.password.length >= 6 ? '' : ' invalid'}`}>
						<label htmlFor="registrationPasswordField">Пароль:</label>
						<input type="password" className="form-control" id="registrationPasswordField" name="registrationPasswordField" required onChange={this.validatePassword.bind(this)} />
					
						<div className="invalid-feedback">
							Пароль должен содержать не менее 6 символов.
						</div>
					</div>
					<div className={`form-group${this.state.password === this.state.repeatedPassword ? '' : ' invalid'}`}>
						<label htmlFor="registrationConfirmPasswordField">Подтверждение пароля:</label>
						<input type="password" className="form-control" id="registrationConfirmPasswordField" name="registrationConfirmPasswordField" required onChange={this.validateRepeatedPassword.bind(this)} />
					
						<div className="invalid-feedback">
							Пароль не совпадают.
						</div>
					</div>

					<div id="captcha"></div>
				</form>
			</Card>
		);
	}
}

export default RegistrationSubpage;
