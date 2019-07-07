import React, { Component } from 'react';

import './Register.scss';

import Card from '../../components/Card/Card';

import RulesSubpage from './components/RulesSubpage';
import RegistrationSubpage from './components/RegistrationSubpage';

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentTab: 'rules'
		};

		this.rulesSubpageRef = React.createRef();
	}

	setNewActiveTab(tabName) {
		if (tabName !== 'registration' || (tabName === 'registration' && this.rulesSubpageRef.current.state.rulesConfirmed)) {
			this.setState({ currentTab: tabName });
		}
	}

	render() {
		return (
			<div className="registration container">
				<Card title="Регистрация">
					<RulesSubpage currentTab={this.state.currentTab} onConfirm={this.setNewActiveTab.bind(this)} ref={this.rulesSubpageRef}></RulesSubpage>
					<RegistrationSubpage currentTab={this.state.currentTab}></RegistrationSubpage>
				</Card>
			</div>
		);
	}
}

export default Register;
