import React, { Component } from 'react';

class Section extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<section id={this.props.id} className={this.props.className}>
				{this.props.children}
			</section>
		);
	}
}

export default Section;
