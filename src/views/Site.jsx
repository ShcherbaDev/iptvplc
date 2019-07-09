import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import isUserLoggedIn from '../assets/js/isUserLoggedIn';

// Components
import Header from '../components/Header/Header';

// Pages
import Main from './main/Main';
import App from './app/App';
import Login from './login/Login';
import Register from './register/Register';
import User from './user/User';
import Admin from './admin/Admin';

class Site extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isUserLoggedIn: false
		};
	}

	componentWillMount() {
		isUserLoggedIn()
			.then((data) => {
				if (data !== undefined) {
					this.setState({ isUserLoggedIn: data.isLoggedIn });
				}
			});
	}

	render() {
		return (
			<Router>
				<Header />

				<Switch>
					<Route exact path="/" render={() => !this.state.isUserLoggedIn ? <Main /> : <Redirect to="/app" />} />

					<Route path="/app" render={() => this.state.isUserLoggedIn ? <App /> : <Redirect to="/" />} />
					<Route path="/login" component={Login} />
					<Route path={["/register", "/register/success"]} component={Register} />
					<Route path="/user/:username" render={() => this.state.isUserLoggedIn ? <User /> : <Redirect to="/" />} />
					<Route path="/admin" component={Admin} />
				</Switch>

				<div className="background"></div>
			</Router>
		);
	}
}

export default Site;
