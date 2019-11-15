import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImagePreview from './ImagePreview';

class Image extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
				<div className="form-group">
					<label htmlFor="imageUrl">URL картинки:</label>
					<input type="url" id="imageUrl"
						className="form-control"
						required
						onChange={e => this.props.onSetPreviewData(e.target.value)} />
				</div>
				<ImagePreview />
			</>
		);
	}
}

export default connect(
	state => ({ store: state }), // Dispatch function is not working without that
	dispatch => ({
		onSetPreviewData(imageUrl) {
			dispatch({
				type: 'SET_PREVIEW_DATA',
				payload: {
					name: imageUrl.split('/').pop().split('?')[0],
					icon: imageUrl,
					url: imageUrl
				}
			});
		}
	})
)(Image);
