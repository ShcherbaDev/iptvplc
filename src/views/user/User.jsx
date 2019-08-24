import React, { Component, Fragment } from 'react';

import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';

import fetchApi from '../../assets/js/fetchApi';
import isUserLoggedIn from '../../assets/js/isUserLoggedIn';

class User extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userData: {},
			subscriptionExpireDate: '',
			isSubscriptionExpired: false,
			activeTab: 'global',
			isModalOpened: false
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

				{new Date().getTime() - (new Date(this.state.userData.subscription_date).getTime()-60000) <= 300000 && (
					<p style={{ marginTop: 20 }}>Подписка доступна только через 5 минут после предыдущей оплаты.</p>
				)}

				<button 
					className="btn btn-block btn-outline-success extend-subscription-btn"
					disabled={new Date().getTime() - (new Date(this.state.userData.subscription_date).getTime()-60000) <= 300000}
					onClick={() => this.setState({ isModalOpened: true })}
					style={{ marginTop: 15 }}>
						Продлить подписку
				</button>

				{this.state.isModalOpened && (
					<Modal title="Продлить подписку" onClose={() => this.setState({ isModalOpened: false })}>
						<div className="alert alert-info">
							<h4 className="alert-heading">Внимание!</h4>
							После приобретения новой подписки перестанет действовать текущая подписка.
						</div>
						<div className="container-fluid">
							<div className="row">
								{app_tariffs.map((tariff, index) =>
									<div className="col text-center" key={index.toString()}>
										<h2>{tariff.duration} мес.</h2>
										<h3>${tariff.price}</h3>

										<a 
											className="btn btn-block btn-outline-success"
											href={`https://sci.interkassa.com/?ik_co_id=5d2c39e61ae1bde78c8b4567&ik_pm_no=Pay_${tariff.duration}&ik_x_userid=${this.state.userData.id}&ik_x_duration=${tariff.duration}&ik_am=${tariff.price*26}&ik_cur=UAH&ik_desc=%D0%9F%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D0%B0+IPTVPLC+%D0%BD%D0%B0+${tariff.duration}+${tariff.duration === 3 ? '%D0%BC%D0%B5%D1%81%D1%8F%D1%86%D0%B0' : '%D0%BC%D0%B5%D1%81%D1%8F%D1%86%D0%B5%D0%B2'}`}
										>
											Продлить
										</a>
									</div>
								)}
							</div>
						</div>
					</Modal>
				)}
			</Fragment>
		);

		return (
			<div className="container content">
				<Card title={`Личный кабинет пользователя ${this.state.userData.username}`} id="userCard">
					{globalAccountData}
					{subscribeData}
				</Card>
			</div>
		);
	}
}

export default User;
