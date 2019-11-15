import React, { Component } from 'react';

import './assets/css/styles.scss';

import Header from './components/sections/Header';
import About from './components/sections/About';
import Contact from './components/sections/Contact';

class Main extends Component {
	componentDidMount() {
		document.querySelector('html').classList = 'landing';
	}

	componentWillUnmount() {
		document.querySelector('html').classList = '';
	}

	render() {
		return (
			<>
				<ul className="nav justify-content-center">
					<li className="nav-item">
						<a href="#about" className="nav-link">О приложении</a>
					</li>
					<li className="nav-item">
						<a href="#contact" className="nav-link">Связаться</a>
					</li>
				</ul>

				<Header />
				<About />
				<Contact />
			</>
		);
	}
}

export default Main;
