import React, { Component } from 'react';

import './Dropdown.scss';

class Dropdown extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="dropdown">
				<button className="btn btn-secondary dropdown-toggle" type="button" id={this.props.id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					{this.props.title}
				</button>
				<div className="dropdown-menu dropdown-menu-lg-right" style={this.props.style} aria-labelledby={this.props.id}>
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Dropdown;
