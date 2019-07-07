import React, { Component } from 'react';

import './Loading.scss';

class Loading extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="loading">
				<span className="spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
				Loading...
			</div>
		);
	}
}

export default Loading;
