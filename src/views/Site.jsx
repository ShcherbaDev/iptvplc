import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import isUserLoggedIn from 'assets/js/isUserLoggedIn';

// Components
import Header from 'components/Header/Header';

// Pages
import Main from './main/Main';
import App from './app/App';
import Login from './login/Login';
import Register from './register/Register';

class Site extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isUserLoggedIn: false
		};
	}

	componentDidMount() {
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
					<Route exact path="/" component={Main} />

					<Route path="/app" component={App} />
					<Route path="/login" component={Login} />
					<Route path={["/register", "/register/success"]} component={Register} />
				</Switch>

				<div className="background"></div>
			</Router>
		);
	}
}

export default Site;
