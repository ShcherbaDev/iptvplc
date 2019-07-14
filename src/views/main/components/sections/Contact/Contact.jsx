import React, { Component } from 'react';

import Section from '../../Section/Section';

class Contact extends Component {
	constructor() {
		super();

		this.state = {
			name: '',
			email: '',
			message: ''
		};
	}
	
	sendMail(event) {
		event.preventDefault();
		
		const captchaResponse = grecaptcha.getResponse();

		if (captchaResponse !== '') {
			const { name, email, message } = this.state;

			fetch('/api/sendMail', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}),
				body: JSON.stringify({
					name, email, message, captchaResponse,
					pageFrom: '/'
				})
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

	render() {
		return (
			<Section id="contact" className="contact">
				<div className="container">
					<h1 className="section-title text-center">Связаться</h1>

					<div className="section-content">
						<div className="container">
							<form action="#" method="POST">
								<div className="form-group">
									<label htmlFor="name">Имя:</label>
									<input type="text" id="name" name="name" className="form-control" value={this.state.name} onChange={this.handleFormChanges.bind(this)} required />
								</div>
								<div className="form-group">
									<label htmlFor="email">Email:</label>
									<input type="email" id="email" name="email" className="form-control" value={this.state.email} onChange={this.handleFormChanges.bind(this)} required />
								</div>
								<div className="form-group">
									<label htmlFor="message">Сообщение:</label>
									<textarea id="message" name="message" className="form-control" rows="10" value={this.state.message} onChange={this.handleFormChanges.bind(this)} required style={{ resize: 'none' }}></textarea>
								</div>

								<div id="submitFormCaptcha" style={{ marginBottom: 10 }}></div>

								<button type="submit" className="btn btn-block btn-outline-success" onClick={this.sendMail.bind(this)} disabled={this.state.name === '' || this.state.email === '' || this.state.message === ''}>Отправить</button>
							</form>
						</div>
					</div>
				</div>
			</Section>
		);
	}
}

export default Contact;
