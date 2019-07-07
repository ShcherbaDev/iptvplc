import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './assets/css/styles.scss';

import Navbar from './components/Navbar/Navbar';

import Header from './components/sections/Header/Header';
import About from './components/sections/About/About';
import Tariffs from './components/sections/Tariffs/Tariffs';
import Contact from './components/sections/Contact/Contact';

class Main extends Component {
	componentDidMount() {
		document.querySelector('html').classList = 'landing';
	}

	componentWillUnmount() {
		document.querySelector('html').classList = '';
	}

	render() {
		return (
			<Fragment>
				<Navbar />

				<Header />
				<About />
				<Tariffs />
				<Contact />
			</Fragment>
		);
	}
}

export default Main;
