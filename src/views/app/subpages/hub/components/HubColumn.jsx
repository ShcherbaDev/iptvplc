import React, { Component } from 'react';

class HubColumn extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const columnTitle = this.props.title && (
			<h2 className="title mb-0">{this.props.title}</h2>
		);
		
		return (
			<div className={this.props.className || ''}>
				{columnTitle}
				{this.props.children}
			</div>
		);
	}
}

export default HubColumn;
