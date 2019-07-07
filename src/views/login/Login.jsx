import React, { Component } from 'react';

import './Login.scss';

import Card from '../../components/Card/Card';
import LoginForm from '../../components/Header/LoginForm/LoginForm';

class Login extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="container login">
				<Card title="Войти в аккаунт">
					<LoginForm />
				</Card>
			</div>
		);
	}
}

export default Login;
