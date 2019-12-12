import React, { Component } from 'react';

import Section from '../Section';

class Header extends Component {
	componentDidMount() {
		const documentHeight = document.documentElement.clientHeight || document.body.clientHeight;
		const headerInfoBlock = document.querySelector('section.main > .container');
		const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

		// Initializing
		headerInfoBlock.style.top = `${Math.floor(scrollTop/6)}px`;

		window.addEventListener('scroll', () => {
			const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

			// Parallax optimization
			if (scrollTop <= documentHeight) {
				// Math.floor method was used here for prevent shaking of a logo
				headerInfoBlock.style.top = `${Math.floor(scrollTop/6)}px`;
			}
		});
	}

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
