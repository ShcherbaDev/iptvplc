import React, { Component } from 'react';

import Section from '../Section';

class About extends Component {
	render() {
		return (
			<Section id="about" className="about">
				<div className="container">
					<h1 className="section-title text-center">О приложении</h1>
					<div className="section-content">
						<p>
							Это приложение позволит Вам создавать свои iptv плейлисты, которые Вы можете использовать на любом типе устройств, от смартфонов до телевизоров. С ним может разобратся даже далекий от интернета человек.
						</p>

						<blockquote className="blockquote">
							<div className="row">
								<div className="col-12 col-xl-2 mb-2 mb-xl-0 symbol">
									<i className="fa fa-quote-left"></i>
								</div>
								<div className="col-12 col-xl-10 text">
									<p className="mb-0">
										Я использую интернет только для проверки почты и прогноза погоды. Когда мой знакомый рассказал про возможности IPTV, я удивился от того, насколько сложно настроить плейлисты. Благодоря этому сайту я без проблем создал свой собственный плейлист, который я смотрю каждый день.
									</p>
									<footer className="blockquote-footer">
										<cite>Алексей, 36 лет</cite>
									</footer>
								</div>
							</div>
						</blockquote>

						<p>
							Как видите, наш продукт очень простой, а значит и удобный в использовании. Еслы Вы загорелись желанием попробовать, то <a href="/register">добро пожаловать</a>!
						</p>

						<a href="/register" className="btn btn-block btn-outline-success">Зарегистрироватся</a>
					</div>
				</div>
			</Section>
		);
	}
}

export default About;
