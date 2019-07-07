import React, { Component } from 'react';

import Section from '../../Section/Section';

class Contact extends Component {
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
									<input type="text" id="name" className="form-control" required />
								</div>
								<div className="form-group">
									<label htmlFor="email">Email:</label>
									<input type="email" id="email" className="form-control" required />
								</div>
								<div className="form-group">
									<label htmlFor="message">Сообщение:</label>
									<textarea id="message" className="form-control" rows="10" required style={{ resize: 'none' }}></textarea>
								</div>

								<button type="submit" className="btn btn-block btn-outline-success">Отправить</button>
							</form>
						</div>
					</div>
				</div>
			</Section>
		);
	}
}

export default Contact;
