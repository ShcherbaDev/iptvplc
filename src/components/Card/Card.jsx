import React, { Component } from 'react';

import './Card.scss';

class Card extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={`card-container${this.props.className !== undefined ? ` ${this.props.className}` : ''}`} id={this.props.id}>
				<div className="card" style={this.props.style}>
					{this.props.title !== undefined && (
						<div className="card-header">
							{this.props.title}
							{this.props.onClose !== undefined && (
								<button
									onClick={this.props.onClose}
									style={{
										position: 'absolute',
										right: 15,
										padding: [0, 8],
										background: 'transparent',
										border: 0,
										color: '#ffffff'
									}}>
										x
								</button>
							)}
						</div>
					)}
					<div className="card-body" style={this.props.bodyStyle}>{this.props.children}</div>
					{this.props.footer !== undefined && <div className="card-footer">{this.props.footer}</div>}
				</div>
			</div>
		);
	}
}

export default Card;
