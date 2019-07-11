import React, { Component } from 'react';

class Tariff extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="col tariff-item text-center">
				<a href="#" target="_blank">
					<h2 className="subscription-duration">{this.props.duration} мес.</h2>
					<h3 className="subscription-price">${this.props.price}</h3>
				</a>
			</div>
		)
	}
}

export default Tariff;
