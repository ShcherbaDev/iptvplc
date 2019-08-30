import React, { Component } from 'react';

import Card from '../../components/Card/Card';

import fetchApi from '../../assets/js/fetchApi';
import isUserLoggedIn from '../../assets/js/isUserLoggedIn';

class User extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userData: {}
		};
	}

	componentWillMount() {
		isUserLoggedIn()
			.then(async (loggedInData) => {
				if (loggedInData.isLoggedIn) {
					if (window.location.pathname === `/user/${loggedInData.username}`) {
						const userData = await fetchApi(`user/${loggedInData.username}`);
						this.setState({
							userData
						});
					}
				}
			});
	}
	
	render() {
		return (
			<div className="container content">
				<Card title={`Личный кабинет пользователя ${this.state.userData.username}`} id="userCard">
					<h1>{this.state.userData.username}</h1>
					<p>Email: {this.state.userData.email}</p>
					{this.state.userData.active === 0 && (
						<div className="alert alert-danger" role="alert">
							<h4 className="alert-heading">Внимание!</h4>
							<p>Вы не подтвердили свой аккаунт! Проверьте свою почту и подтвердите аккаунт что-бы получить полный доступ к приложению.</p>
						</div>
					)}
				</Card>
			</div>
		);
	}
}

export default User;
