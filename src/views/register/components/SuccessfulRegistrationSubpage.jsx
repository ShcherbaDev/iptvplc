import React, { Component } from 'react';
import Card from 'components/Card/Card';

class SuccessfulRegistrationSubpage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Card title="Регистрация прошла успешно!" className={this.props.currentTab === 'success' ? 'active' : 'unactive'}>
				<p>Ваш аккаунт был успешно создан!</p>
				<p className="mb-0">
					Пожалуйста, проверьте свою электронную почту для подтверждения аккаунта.<br/>
					Если Вы не нашли письма с подтверждением регистрации, проверьте папку со спамом.
				</p>
			</Card>
		);
	}
}

export default SuccessfulRegistrationSubpage;
