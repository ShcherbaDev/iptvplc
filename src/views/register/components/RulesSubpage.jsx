import React, { Component } from 'react';

class RulesSubpage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rulesConfirmed: false
		};
	}

	confirmRules() {
		this.setState({ rulesConfirmed: event.target.checked });
	}

	handleConfirm() {
		this.props.onConfirm('registration');
	}

	render() {
		return (
			<div className={`card-part${this.props.currentTab === 'rules' ? ' active' : ''}`}>
				<div className="card-part-content">
					Пожалуйста, перед регистрацией прочтите правила сайта.

					<div className="rules-block border border-success rounded">
						ОСНОВНЫЕ ПРАВИЛА ПРОГРАММЫ
						<ul className="main-rules">
							<li>Данная программа позволяет без труда создать IPTV плейлист в формате .m3u для любого устройства и плеера способного воспроизводить это расширение.</li>
							<li>Данные для плейлиста берутся из разных открытых источников.</li>
							<li>Что-бы получить доступ к программе, необходимо зарегистрироваться и подтвердить свою электронную почту. Конфиденциальные данные используются только для стабильной работы программы и никому не разглашаются.</li>
							<li>После регистрации Вы попадете на страницу с основным контентом программы, где Вам будет предложено бесплатных 3 дня использования.</li>
							<li>После истечения пробного периода, для продолжения использования необходимо заплатить чисто символическую суму равную 1$ США за каждые 3 месяца использования программы.</li>
							<li>Оплата проводится через международную платежную систему «Interkassa».</li>
							<li>
								Программа не гарантирует постоянный показ всех каналов
								<ul>
									<li>Возможны зависания каналов в случае недостатка скорости подключения к Интернету.</li>
									<li>В случае выпадания ошибок при воспроизведении канала, напишите на странице «обратная связь».</li>
									<li>В случае длительного пропадания канала, напишите на странице «обратная связь».</li>
								</ul>
							</li>
						</ul>

						ПРАВИЛА ПОЛЬЗОВАНИЯ ПРОГРАММОЙ
						<ul className="use-rules">
							<li>На основной странице Вы видите 2 поля и кнопки управления между ними. В левом поле размещены телевизионные каналы по категориям. Выбор категории производится через выпадающий список сверху поля.</li>
							<li>После выбора категории выберите интересующий Вас канал и с зажатой левой кнопкой мышки перетащите на правое поле. Можно воспользоваться соответствующими кнопками для перемещения нужного канала между полями. Для создания плейлиста операцию повторите со всеми интересующими каналами.</li>
							<li>После выбора всех интересующих Вас каналов, нажмите на кнопку «Save». В случае выпадания диалогового окна выберите место сохранения плейлиста. В противном случае, плейлист сохранится в выбранной в настройках браузера папке для сохранения файлов.</li>
							<li>Сохраненный файл будет с расширением .m3u, его можно воспроизводить на устройствах и в плеерах, способных воспроизводить этот формат (например: VLC player, смарт приставки к ТВ и т.д.).</li>
							<li>Желаем приятного просмотра!</li>
						</ul>
					</div>
					
					<div className="rules-confirm form-check">
						<input type="checkbox" className="form-check-input" id="rulesConfirmCheckbox" onChange={this.confirmRules.bind(this)} />
						<label className="form-check-label" htmlFor="rulesConfirmCheckbox">Я согласен с правилами сайта</label>
					</div>
				</div>

				<div className="confirm-btn-container">
					<button className="btn btn-block btn-outline-success" disabled={!this.state.rulesConfirmed} onClick={this.handleConfirm.bind(this)}>Продолжить</button>
				</div>
			</div>
		);
	}
}

export default RulesSubpage;
