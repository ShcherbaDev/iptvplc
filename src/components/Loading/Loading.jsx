import React, { Component } from 'react';

import './Loading.scss';

class Loading extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="loading-grid">
				<div className="loading-spin"></div>
				<p>Загрузка...</p>
			</div>
		);
	}
}

export default Loading;
