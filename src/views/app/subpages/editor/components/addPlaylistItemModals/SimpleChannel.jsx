import React, { Component } from 'react';
import { connect } from 'react-redux';

class SimpleChannel extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.previewData.name !== '') {
			return (
				<Fragment>
					<div className="form-group">
						<label htmlFor="channelName">Название:</label>
						<input type="text" id="channelName" className="form-control"
							required 
							onChange={e => this.props.onSetPreviewData('name', e.target.value)} />
					</div>
					<div className="form-group">
						<label htmlFor="channelIcon">URL иконки:</label>
						<input type="url" id="channelIcon" className="form-control"
							required 
							onChange={e => this.props.onSetPreviewData('icon', e.target.value)} />
					</div>
					<div className="form-group">
						<label htmlFor="channelUrl">URL:</label>
						<input type="url" id="channelUrl" className="form-control"
							required 
							onChange={e => this.props.onSetPreviewData('url', e.target.value)} />
					</div>
				</Fragment>
			);
		}
		return null;
	}
}

export default connect(
	state => ({ previewData: state.appReducer.previewData }), // Dispatch function is not working without that
	dispatch => ({
		onSetPreviewData(key, value) {
			dispatch({
				type: 'SET_PREVIEW_DATA',
				payload: {
					...this.previewData,
					[key]: value
				}
			})
		}
	})
)(SimpleChannel);
