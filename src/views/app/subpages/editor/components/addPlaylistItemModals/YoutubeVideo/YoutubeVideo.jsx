import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import YoutubeVideoPreview from './YoutubeVideoPreview';

class YoutubeVideo extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Fragment>
				<div className="form-group">
					<label htmlFor="youtubeVideoUrl">URL видео:</label>
					<input type="url" id="youtubeVideoUrl"
						className="form-control"
						required
						placeholder="https://youtube.com/..."
						onChange={e => this.props.onSetPreviewData(e.target.value)} />
				</div>
				<YoutubeVideoPreview />
			</Fragment>
		);
	}
}

export default connect(
	state => ({ store: state }), // Dispatch function is not working without that
	dispatch => ({
		onSetPreviewData(videoUrl) {
			const regex = /youtube\.com.*(\?v=|\/embed\/)(.{11})/;
			if (regex.test(videoUrl)) {
				fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoUrl.match(regex).pop()}&key=AIzaSyA7lR5SxEB0k_Emr6cLKlPoyKZksvovfAA&part=snippet`)
					.then(response => response.json())
					.then(response => {
						const videoData = response.items[0].snippet;

						dispatch({
							type: 'SET_PREVIEW_DATA',
							payload: {
								name: videoData.title,
								icon: videoData.thumbnails.medium.url,
								url: `https://youtube.com/watch?v=${response.items[0].id}`,
								channel: videoData.channelTitle
							}
						});
					});
			}
		}
	})
)(YoutubeVideo);
