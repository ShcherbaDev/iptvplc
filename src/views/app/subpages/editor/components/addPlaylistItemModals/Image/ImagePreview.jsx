import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../../../../../../../components/Card/Card';

class ImagePreview extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.previewData.url !== '') {
			return (
				<Card className="preview" title="Предпросмотр картинки:" bodyStyle={{
					backgroundColor: "rgba(24, 24, 24, .8)"
				}}>
					<div className="row">
						<div className="col-3 thumbnail">
							<img src={this.props.previewData.icon} alt={this.props.previewData.name} style={{ width: '100%' }} />
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
)(ImagePreview);
