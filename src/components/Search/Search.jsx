import React, { Component } from 'react';

class Search extends Component {
	constructor(props) {
		super(props);
	}
 
	render() {
		return (
			<input type="text" className="form-control my-2" {...this.props} />
		);
	}
}

export default Search;
