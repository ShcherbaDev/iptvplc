import React, { Component } from 'react';

import Section from '../../Section/Section';
import Tariff from './components/Tariff';

import './Tariffs.scss';

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
								<Tariff duration="3" price="1" />
								<Tariff duration="6" price="2" />
								<Tariff duration="9" price="3" />
								<Tariff duration="12" price="4" />
							</div>
						</div>
					</div>
				</div>
				<div className="section-background"></div>
			</Section>
		);
	}
}

export default Tariffs;
