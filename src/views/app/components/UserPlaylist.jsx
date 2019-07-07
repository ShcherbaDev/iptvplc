import React, { Component } from 'react';
import { connect } from 'react-redux';

import PlaylistItem from './PlaylistItem';

class UserPlaylist extends Component {
	constructor(props) {
		super(props);
	}

	onDragOver(event) {
		event.preventDefault();
	}

	onDrop(event) {
		const transferredPlaylistItem = JSON.parse(event.dataTransfer.getData('playlistItem'));

		// If draggable item isn't exist in necessary playlist
		if (this.props.appStore.userPlaylist.findIndex(item => item.id === transferredPlaylistItem.id) === -1) {
			this.props.onMovePlaylistItemToUserPlaylist(transferredPlaylistItem);
		}
	}

	render() {
		const list = [];

		this.props.appStore.userPlaylist.map((item) => {
			list.push(
				<PlaylistItem key={item.id} item={item}></PlaylistItem>
			);
		});

		return (
			<div 
				className="list_block user_playlist col"
				onDragOver={this.onDragOver}
				onDrop={this.onDrop.bind(this)}>
				<ul className="list">
					{list}
				</ul>
			</div>
		);
	}
}

export default connect(
	state => ({ appStore: state }),
	dispatch => ({
		onMovePlaylistItemToUserPlaylist: (item) => {
			dispatch({ type: 'ADD_ITEM_TO_USER_PLAYLIST', payload: item });
		}
	})
)(UserPlaylist);
