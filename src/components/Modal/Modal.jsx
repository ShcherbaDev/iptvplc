import React, { Component } from 'react';
import { createPortal } from 'react-dom';

import Card from '../Card/Card';

import './Modal.scss';

class Modal extends Component {
	constructor(props) {
		super(props);
	}
 
	render() {
		return createPortal(
			(
				<div className="modal-container">
					<Card
						title={this.props.title}
						footer={this.props.footer}
						onClose={this.props.onClose}
						style={this.props.style}>
						{this.props.children}
					</Card>
				</div>
			),
			document.body
		);
	}
}

export default Modal;
