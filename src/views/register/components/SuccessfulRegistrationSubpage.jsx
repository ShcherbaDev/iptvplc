import React, { Component, Fragment } from 'react';

class SuccessfulRegistrationSubpage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={`card-part${this.props.currentTab === 'success' ? ' active' : ''}`}>
				<Fragment>
					<p>Ваш аккаунт был успешно создан!</p>
					<p>
						Пожалуйста, проверьте свою электронную почту для подтверждения аккаунта.<br/>
						Если Вы не нашли письма с подтверждением регистрации, проверьте папку со спамом.
					</p>
				</Fragment>
			</div>
		);
	}
}

export default SuccessfulRegistrationSubpage;
