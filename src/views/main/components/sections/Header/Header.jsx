import React, { Component } from 'react';

import Section from '../../Section/Section';

class Header extends Component {
	render() {
		return (
			<Section className="main">
				<div className="container">
					<div className="row">
						<div className="col-lg logo">
							<img src="/static/images/iptvplc.svg" alt="App logo" className="app-logo" />
						</div>
						<div className="col-lg app-description">
							<div className="row">
								<div className="col title">Создавать плейлисты стало проще</div>
								<div className="w-100"></div>
								<div className="col about-btn">
									<a href="#about" className="btn btn-block btn-outline-success">Подробнее</a>
								</div>
								<div className="w-100"></div>
								<div className="col sign-in">
									Уже есть аккаунт? <a href="/login">Войти</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="background">
					<div className="background-image"></div>
				</div>
			</Section>
		);
	}
}

export default Header;
