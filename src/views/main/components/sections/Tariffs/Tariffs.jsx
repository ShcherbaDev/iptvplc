import React, { Component } from 'react';

import Section from '../../Section/Section';

class Tariffs extends Component {
	render() {
		return (
			<Section id="tariffs" className="tariffs">
				<div className="container">
					<h1 className="section-title text-center">Стоимость подписки</h1>
					<p className="text-center">Первые 3 дня после регистрации приложение работает бесплатно </p>

					<div className="section-content">
						<div className="container">
							<div className="row">
								<div className="col text-center">
									<h2 className="subscription-price">$1</h2>
									<h3 className="subscription-duration">3 мес.</h3>
								</div>
								<div className="col text-center">
									<h2 className="subscription-price">$4</h2>
									<h3 className="subscription-duration">12 мес.</h3>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="background"></div>
			</Section>
		);
	}
}

export default Tariffs;
