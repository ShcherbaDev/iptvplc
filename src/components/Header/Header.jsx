import React, { Component } from 'react';

import './Header.scss';

import Dropdown from '../Dropdown/Dropdown';
import Modal from '../Modal/Modal';

import isUserLoggedIn from '../../assets/js/isUserLoggedIn';
import fetchApi from '../../assets/js/fetchApi';

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: null,
			email: null,

			showFeedbackModal: false,
			isCaptchaRendered: false,
			message: ''
		};
	}

	componentDidMount() {
		isUserLoggedIn()
			.then(async (loggedInData) => {
				const { isLoggedIn, username } = loggedInData;

				if (isLoggedIn) {
					const { email } = await fetchApi(`/user/${username}`);
					this.setState({ username, email });
				}
			});
	}

	logout(event) {
		event.preventDefault();

		fetch('/api/logout', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(() => {
			window.location.href = '/';
		});
	}

	shouldShowHeader() {
		return window.location.pathname !== '/' 
			&& window.location.pathname !== '/login' 
			&& window.location.pathname !== '/register'
			&& window.location.pathname !== '/register/success';
	}

	sendMail() {
		event.preventDefault();
		
		const captchaResponse = grecaptcha.getResponse();

		if (captchaResponse !== '') {
			const { username, email, message } = this.state;

			fetch('/api/sendMail', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}),
				body: JSON.stringify({
					name: username,
					email,
					message,
					captchaResponse,
					pageFrom: '/app'
				})
			})
				.then(() => {
					alert('Сообщение было успешно отправлено!');
				})
				.catch(() => {
					alert('Во время отправки сообщения произошла ошибка.\nПожалуйста, попробуйте ещё раз.');
				});
		}
		else {
			alert('Для отправки сообщения, пожалуйста, пройдите капчу.');
		}
	}

	handleFormChanges(event) {
		const { name, value } = event.target;

		this.setState({
			[name]: value
		});
	}

	componentDidUpdate() {
		if (this.state.showFeedbackModal && !this.state.isCaptchaRendered) {
			this.setState({ isCaptchaRendered: true });
			grecaptcha.render('feedbackCaptcha', {
				'sitekey': captcha_key,
				'theme': captcha_theme
			});
		}
		if (!this.state.showFeedbackModal && this.state.isCaptchaRendered) {
			this.setState({ isCaptchaRendered: false });
		}
	}

	render() {
		return (
			(this.shouldShowHeader() && (
				<nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarToggle">
						<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
							<li className="nav-item">
								<a href="/" className="nav-link">Главная</a>
							</li>
							<li className="nav-item">
								<a href="#" className="nav-link" onClick={() => this.setState({ showFeedbackModal: true })}>Обратная связь</a>
							</li>
						</ul>

						<div className="mt-2 mt-lg-0">
							<Dropdown style={{ padding: 10 }} id="user-controls" title={this.state.username === null ? <span>Войти / Зарегистрироватся</span> : this.state.username}>
								<a href={`/user/${this.state.username}`} className="dropdown-item">Личный кабинет</a>
								<a href="#" className="logout btn btn-danger btn-block" onClick={(event) => this.logout(event)}>Выйти</a>
							</Dropdown>
						</div>
					</div>

					{this.state.showFeedbackModal && (
						<Modal title="Отправка сообщения" onClose={() => this.setState({ showFeedbackModal: false })}>
							<form action="#" method="POST">
								<div className="form-group">
									<label htmlFor="message">Сообщение:</label>
									<textarea id="message" name="message" className="form-control" rows="10" value={this.state.message} onChange={this.handleFormChanges.bind(this)} required style={{ resize: 'none' }}></textarea>
								</div>

								<div id="feedbackCaptcha" style={{ marginBottom: 10 }}></div>

								<button type="submit" className="btn btn-block btn-outline-success" onClick={this.sendMail.bind(this)} disabled={this.state.message === ''}>Отправить</button>
							</form>
						</Modal>
					)}
				</nav>
			))
		);
	}
}

export default Header;
