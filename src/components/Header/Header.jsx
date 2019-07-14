import React, { Component } from 'react';

import './Header.scss';

import Dropdown from '../Dropdown/Dropdown';

import isUserLoggedIn from '../../assets/js/isUserLoggedIn';

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: null
		};
	}

	componentDidMount() {
		isUserLoggedIn()
			.then((loggedInData) => {
				if (loggedInData.isLoggedIn) {
					this.setState({ username: loggedInData.username });
				}
			});
	}

	logout(event) {
		event.preventDefault();

		fetch('/api/logout', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(() => {
			window.location.href = '/';
		});
	}

	shouldShowHeader() {
		return window.location.pathname !== '/' 
			&& window.location.pathname !== '/login' 
			&& window.location.pathname !== '/register'
			&& window.location.pathname !== '/register/success';
	}

	render() {
		return (
			(this.shouldShowHeader() && (
			<nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarToggle">
					<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
						<li className="nav-item">
							<a href="/" className="nav-link">Главная</a>
						</li>
						<li className="nav-item">
							<a href="#" className="nav-link">Обратная связь</a>
						</li>
					</ul>

					<div className="mt-2 mt-lg-0">
						<Dropdown style={{ padding: 10 }} id="user-controls" title={this.state.username === null ? <span>Войти / Зарегистрироватся</span> : this.state.username}>
							<a href={`/user/${this.state.username}`} className="dropdown-item">Личный кабинет</a>
							<a href="#" className="logout btn btn-danger btn-block" onClick={(event) => this.logout(event)}>Выйти</a>
						</Dropdown>
					</div>
				</div>
			</nav>))
		);
	}
}

export default Header;
