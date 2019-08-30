import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../../../../../../../components/Card/Card';

class YoutubeVieoPreview extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.previewData.name !== '') {
			return (
				<Card className="preview" title="Информация о видео:" bodyStyle={{
					backgroundColor: "rgba(24, 24, 24, .8)"
				}}>
					<div className="row">
						<div className="col-3 thumbnail">
							<img src={this.props.previewData.icon} alt={this.props.previewData.name} style={{ width: '100%' }} />
						</div>
						<div className="col data" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
							<h3>Название: {this.props.previewData.name}</h3>
							<h4 style={{ color: '#ddd' }}>Автор: {this.props.previewData.channel}</h4>
						</div>
					</div>
				</Card>
			);
		}
		return null;
	}
}

export default connect(
	state => ({ previewData: state.appReducer.previewData })
)(YoutubeVieoPreview);
