import React, { Component } from 'react';

class Navbar extends Component {
	render() {
		return (
			<ul className="nav justify-content-center">
				<li className="nav-item">
					<a href="#about" className="nav-link">О приложении</a>
				</li>
				<li className="nav-item">
					<a href="#tariffs" className="nav-link">Подписка</a>
				</li>
				<li className="nav-item">
					<a href="#contact" className="nav-link">Связаться</a>
				</li>
			</ul>
		);
	}
}

export default Navbar;
