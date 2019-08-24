import React, { Component } from 'react';

import Card from '../../components/Card/Card';

class PaymentError extends Component {
	render() {
		return (
			<div className="container content">
				<Card title="Ошибка!">
					<p>Во время обработки платежа произошла ошибка</p>
					<a href="/app" className="btn btn-block btn-outline-success">Вернутся к программе</a>
				</Card>
			</div>
		);
	}
}

export default PaymentError;
