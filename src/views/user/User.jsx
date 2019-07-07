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
					const userData = await fetchApi(`user/${loggedInData.username}`);

					if (this.props.match.params.username === loggedInData.username) {
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
								{this.state.userData.isDemoMode ? ("Демо-подписка") : ("Обычная подписка")}
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

		const accountOwnerView = (
			<div className="row">
				<div className="col-3" style={{ paddingLeft: 0 }}>
					<div className="nav flex-column nav-pills">
						<a className={`nav-link${this.state.activeTab === 'global' ? ' active' : ''}`} href="#global" onClick={this.setNewActiveTab.bind(this, 'global')}>Основное</a>
						<a className={`nav-link${this.state.activeTab === 'billing' ? ' active' : ''}`} href="#billing" onClick={this.setNewActiveTab.bind(this, 'billing')}>Подписка {this.state.isSubscriptionExpired && <span className={`badge ${this.state.activeTab === 'billing' ? 'badge-light' : 'badge-danger'}`}>!</span>}</a>
					</div>
				</div>
				<div className="col-9" style={{ paddingRight: 0 }}>
					<div className="tab-content" style={{ maxHeight: 450, overflow: 'auto' }}>
						<div className={`tab-pane${this.state.activeTab === 'global' ? ' show active' : ''}`}>
							{globalAccountData}
						</div>
						<div className={`tab-pane${this.state.activeTab === 'billing' ? ' show active' : ''}`}>
							{subscribeData}
						</div>
					</div>
				</div>
			</div>
		);

		return (
			<div className="content container">
				{/* If user data is an empty object */}
				{Object.entries(this.state.userData).length === 0 && this.state.userData.constructor === Object ? (
					<Card title="Ошибка!" style={{ margin: '0 auto', width: '50%' }}>
						Только владелец аккаунта может просмотреть свой профиль!
					</Card>
				) : (
					<Card title={`Личный кабинет ${this.state.userData.username}`} style={{ height: 541 }}>
						{accountOwnerView}
					</Card>
				)}
			</div>
		);
	}
}

export default User;
