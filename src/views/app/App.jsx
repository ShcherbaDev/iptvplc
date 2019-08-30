import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Card from '../../components/Card/Card';

import Editor from './subpages/editor/Editor';
import Hub from './subpages/hub/Hub';

import fetchApi from '../../assets/js/fetchApi';
import isUserLoggedIn from '../../assets/js/isUserLoggedIn';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isUserLoggedIn: false,
			isUserActive: false
		};
	}

	componentDidMount() {
		isUserLoggedIn()
			.then(async (loggedInData) => {
				this.setState({ isUserLoggedIn: loggedInData.isLoggedIn });

				if (loggedInData.isLoggedIn) {
					const userData = await fetchApi(`user/${loggedInData.username}`);
					this.setState({ isUserActive: userData.active === 1 });
				}
			});
	}

	render() {
		const loggedInContent = (
			(() => {
				switch (this.props.appStore.currentSubpage) {
					case 'hub':
						return <Hub />;

					case 'editor':
						return <Editor />;
					
					default:
						return (
							<div className="content container">
								<Card title="Ошибка!">
									<p>
										Невозможно отрисовать страницу.<br/>
										Пожалуйста, попробуйте ещё раз.
									</p>
								</Card>
							</div>
						);
				}
			})()
		);

		if (this.state.isUserLoggedIn) {
			if (this.state.isUserActive) {
				return loggedInContent;
			}
			else {
				return (
					<Card title="Внимание!" style={{ width: '66%', margin: '0 auto' }}>
						Для получения доступа к приложению подтвердите свой аккаунт через электронную почту.
					</Card>
				);
			}
		}
		else {
			return (
				<Card title="Внимание!" style={{ width: '48%', margin: '0 auto' }}>
		 			Приложение доступно только для зарегистрированных пользователей!<br />
		 			Пожалуйста, <Link to="/login">войдите</Link> или <Link to="/register">зарегистрируйтесь</Link> что-бы продолжить.
				</Card>
			);
		}
	}
}

export default connect(
	state => ({ appStore: state.appReducer })
)(App);
