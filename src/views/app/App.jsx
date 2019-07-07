import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import DefaultPlaylist from './components/DefaultPlaylist';
import UserPlaylist from './components/UserPlaylist';
import Controls from './components/Controls';
import Card from '../../components/Card/Card';

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
					this.setState({ isUserActive: userData.active === 1 })
				}
			});
	}

	componentWillUnmount() {
		this.props.onClearPlaylists();
	}

	render() {
		const loggedInContent = (
			<div className="row">
				<DefaultPlaylist></DefaultPlaylist>
				<Controls></Controls>
				<UserPlaylist></UserPlaylist>
			</div>
		);

		const notActiveUserContent = (
			<Card title="Внимание!" style={{ width: '66%', margin: '0 auto' }}>
				Для получения доступа к приложению подтвердите свой аккаунт через электронную почту.
			</Card>
		);

		const notLoggedInContent = (
			<Card title="Внимание!" style={{ width: '48%', margin: '0 auto' }}>
				Приложение доступно только для зарегистрированных пользователей!<br />
				Пожалуйста, <Link to="/login">войдите</Link> или <Link to="/register">зарегистрируйтесь</Link> что-бы продолжить.
			</Card>
		);

		return (
			<div className="content container">
				{this.state.isUserLoggedIn && this.state.isUserActive ? loggedInContent : (this.state.isUserLoggedIn ? notActiveUserContent : notLoggedInContent )}
			</div>
		);
	}
}

export default connect(
	state => ({ appStore: state }),
	dispatch => ({
		onClearPlaylists: () => {
			dispatch({ type: 'CLEAR_PLAYLISTS' })
		}
	})
)(App);
