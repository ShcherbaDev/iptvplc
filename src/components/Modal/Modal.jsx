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
					<Card title={this.props.title} onClose={this.props.onClose} footer={this.props.footer}>
						{this.props.children}
					</Card>
				</div>
			),
			document.body
		);
	}
}

export default Modal;
