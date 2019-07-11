import React, { Component, Fragment } from 'react';

import Card from '../../components/Card/Card';

import fetchApi from '../../assets/js/fetchApi';
import isUserLoggedIn from '../../assets/js/isUserLoggedIn';

class User extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userData: {},
			subscriptionExpireDate: '',
			isSubscriptionExpired: false,
			activeTab: 'global'
		};
	}

	componentWillMount() {
		isUserLoggedIn()
			.then(async (loggedInData) => {
				if (loggedInData.isLoggedIn) {
					if (window.location.pathname === `/user/${loggedInData.username}`) {
						const userData = await fetchApi(`user/${loggedInData.username}`);
						this.setState({
							userData,
							subscriptionExpireDate: new Date(userData.unsubscription_date).toLocaleDateString(),
							isSubscriptionExpired: new Date(Date.now()) >= new Date(userData.unsubscription_date)
						});
					}
				}
			});
	}

	setNewActiveTab(newTabName) {
		this.setState({
			activeTab: newTabName
		});
	}

	copyReferralLink() {
		const input = document.querySelector('input#referral-link');
		input.focus();
		input.select();
		document.execCommand('copy');
	}

	render() {
		const globalAccountData = (
			<Fragment>
				<h1>{this.state.userData.username}</h1>
				<p>Email: {this.state.userData.email}</p>
				{this.state.userData.active === 0 && (
					<div className="alert alert-danger" role="alert">
						<h4 className="alert-heading">Внимание!</h4>
						<p>Вы не подтвердили свой аккаунт! Проверьте свою почту и подтвердите аккаунт что-бы получить полный доступ к приложению.</p>
					</div>
				)}
				<div className="form-group">
					<label htmlFor="referral-link">Ваша реферальная ссылка:</label>
					<div className="input-group">
						<input type="text" className="form-control" id="referral-link" value={`${window.location.origin}/referral/${this.state.userData.username}`} readOnly />
						<div className="input-group-append">
							<button className="btn btn-success" onClick={this.copyReferralLink}>Скопировать</button>
						</div>
					</div>
				</div>
			</Fragment>
		);

		const subscribeData = (
			<Fragment>
				<h1>Состояние подписки:</h1>

				<table className="table table-responsive-sm">
					<thead>
						<tr>
							<th scope="row">Название подписки</th>
							<th scope="row">Состояние</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td scope="row">
								{this.state.userData.isDemoMode ? "Демо-подписка" : "Обычная подписка"}
							</td>
							<td scope="row">
								{this.state.isSubscriptionExpired ? (
									<span className="text-danger">Срок действия подписки закончился</span>
								) : (
									<span className="text-success">Действителен (до {this.state.subscriptionExpireDate.replace(/\./g, '/')})</span>
								)}
							</td>
						</tr>
					</tbody>
				</table>

				{this.state.isSubscriptionExpired && (
					<a className="btn btn-block btn-primary" href="#">Продлить подписку</a>
				)}
			</Fragment>
		);

		return (
			<div className="container content">
				<Card title={`Личный кабинет пользователя ${this.state.userData.username}`}>
					{globalAccountData}
					{subscribeData}
				</Card>
			</div>
		);
	}
}

export default User;
