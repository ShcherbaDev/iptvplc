import React, { Component } from 'react';

import './Register.scss';

import RulesSubpage from './components/RulesSubpage';
import RegistrationSubpage from './components/RegistrationSubpage';
import SuccessfulRegistrationSubpage from './components/SuccessfulRegistrationSubpage';

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentTab: 'rules'
		};

		this.rulesSubpageRef = React.createRef();
	}

	componentWillMount() {
		if (window.location.pathname === '/register/success') {
			this.setState({
				currentTab: 'success'
			});
		}
	}

	setNewActiveTab(tabName) {
		if (tabName !== 'registration' || (tabName === 'registration' && this.rulesSubpageRef.current.state.rulesConfirmed)) {
			this.setState({ currentTab: tabName });
		}
	}

	render() {
		return (
			<div className="container content">
				<RulesSubpage currentTab={this.state.currentTab} onConfirm={this.setNewActiveTab.bind(this)} ref={this.rulesSubpageRef} />
				<RegistrationSubpage currentTab={this.state.currentTab} />
				<SuccessfulRegistrationSubpage currentTab={this.state.currentTab} />
			</div>
		);
	}
}

export default Register;
