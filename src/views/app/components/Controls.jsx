import React, { Component } from 'react';
import { connect } from 'react-redux';

import saveUserPlaylist from '../../../assets/js/saveUserPlaylist';

class Controls extends Component {
	constructor(props) {
		super(props);
	}
	
	onMovePlaylistItemToUserPlaylist() {
		Object.keys(this.props.appStore.defaultPlaylist).forEach((playlistName) => {
			// If was found
			if (this.props.appStore.defaultPlaylist[playlistName].findIndex((item) => item.id === this.props.appStore.selectedPlaylistItems) !== -1) {
				const playlistItemIndex = this.props.appStore.defaultPlaylist[playlistName].findIndex((item) => item.id === this.props.appStore.selectedPlaylistItems);
				return this.props.onMovePlaylistItemToUserPlaylist(this.props.appStore.defaultPlaylist[playlistName][playlistItemIndex]);
			}
		});
	}

	onMovePlaylistItemToDefaultPlaylist() {
		// Find playlist item in user playlist
		const itemIndexInPlaylist = this.props.appStore.userPlaylist.findIndex(item => item.id === this.props.appStore.selectedPlaylistItems);
		const itemInPlaylist = this.props.appStore.userPlaylist[itemIndexInPlaylist];

		if (itemIndexInPlaylist !== -1) {
			this.props.onMovePlaylistItemToDefaultPlaylist(itemInPlaylist);
		}
	}

	onPressingSaveButton(event) {
		saveUserPlaylist(this.props.appStore.userPlaylist);
	}

	render() {
		return (
			<div className="controls col-1">
				<div className="top btn_group_vertical">
					{/* Button for moving playlist item to user playlist */}
					<button className="btn btn-outline-primary" onClick={this.onMovePlaylistItemToUserPlaylist.bind(this)}>&gt;</button>

					{/* Button for moving playlist item to default playlist */}
					<button className="btn btn-outline-primary" onClick={this.onMovePlaylistItemToDefaultPlaylist.bind(this)}>&lt;</button>
				</div>
				<div className="bottom">
					<button className="btn btn-success" disabled={this.props.appStore.userPlaylist.length === 0} onClick={this.onPressingSaveButton.bind(this)}>Save</button>
				</div>
			</div>
		);
	}
}

export default connect(
	state => ({ appStore: state }),
	dispatch => ({
		onMovePlaylistItemToDefaultPlaylist: (item) => {
			dispatch({ type: 'ADD_ITEM_TO_DEFAULT_PLAYLIST', payload: item });
		},
		onMovePlaylistItemToUserPlaylist: (item) => {
			dispatch({ type: 'ADD_ITEM_TO_USER_PLAYLIST', payload: item });
		}
	})
)(Controls);
