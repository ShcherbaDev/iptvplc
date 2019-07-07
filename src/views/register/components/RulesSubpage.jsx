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

					<p className="rules text-monospace border border-success rounded">
						<img src="https://scontent-lhr3-1.cdninstagram.com/vp/a6ea4a985de34c21604d58713c607c85/5D8D71A6/t51.2885-15/e35/53604922_318048095523304_7249775776393780299_n.jpg?_nc_ht=scontent-lhr3-1.cdninstagram.com&ig_cache_key=MjAwNDY1NjU5MTY2MDg0MzI2OA%3D%3D.2" alt="кхъ" className="img-responsive" />
					</p>
					
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
