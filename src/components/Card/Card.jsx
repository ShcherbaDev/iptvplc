import React, { Component } from 'react';

import './Card.scss';

class Card extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="card-container">
				<div className="card" style={this.props.style}>
					{this.props.title !== undefined && <div className="card-header">{this.props.title}</div>}
					<div className="card-body" style={this.props.bodyStyle}>{this.props.children}</div>
				</div>
			</div>
		);
	}
}

export default Card;
