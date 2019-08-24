import React, { Component } from 'react';

import Card from '../../components/Card/Card';

class SuccessPayment extends Component {
	render() {
		return (
			<div className="container content">
				<Card title="Успех!">
					<p>Платеж успешно совершен!</p>
					<a href="/app" className="btn btn-block btn-outline-success">Вернутся к программе</a>
				</Card>
			</div>
		);
	}
}

export default SuccessPayment;
