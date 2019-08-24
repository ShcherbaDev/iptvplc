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
								{app_tariffs.map((tariff, index) =>
									<Tariff {...tariff} key={index.toString()} />
								)}
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
