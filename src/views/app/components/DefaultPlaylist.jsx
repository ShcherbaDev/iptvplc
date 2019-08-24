import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import PlaylistItem from './PlaylistItem';
import Loading from '../../../components/Loading/Loading';

import parseM3uToJson from '../../../assets/js/parseM3U';

class DefaultPlaylist extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			playlistItemsGroupId: 0,
			playlist: {},
			isLoading: true
		};
	}

	getPlaylistItemsByGroup(groupIdOrName) {
		if (typeof groupIdOrName === 'number') {
			return this.props.appStore.playlistCreatorReducer.defaultPlaylist[Object.keys(this.props.appStore.playlistCreatorReducer.defaultPlaylist)[groupIdOrName]];
		}
		else if (typeof groupIdOrName === 'string') {
			return this.props.appStore.playlistCreatorReducer.defaultPlaylist[groupIdOrName];
		}
	}

	componentWillMount() {
		parseM3uToJson('/static/playlists/iptvchannels.m3u')
			.then((data) => {
				this.props.onSetDefaultPlaylist(data);
			});
	}
	
	componentWillReceiveProps() {
		this.setState({ isLoading: false });
	}

	onDragOver(event) {
		event.preventDefault();
	}

	onDrop(event) {
		const transferredPlaylistItem = JSON.parse(event.dataTransfer.getData('playlistItem'));

		// If draggable item isn't exist in necessary playlist
		if (this.props.appStore.playlistCreatorReducer.defaultPlaylist[transferredPlaylistItem.inf.group].findIndex(item => item.id === transferredPlaylistItem.id) === -1) {
			this.props.onMovePlaylistItemToDefaultPlaylist(transferredPlaylistItem);
		}
	}

	changePlaylistGroup(event) {
		this.setState({ playlistItemsGroupId: event.target.options.selectedIndex });
	}

	render() {
		const playlistKeys = Object.keys(this.props.appStore.playlistCreatorReducer.defaultPlaylist);

		let groupOptions = [];
		let list = [];

		if (playlistKeys.length > 0) {
			groupOptions = playlistKeys.map((groupName, index) => 
				<option key={index} value={groupName}>{groupName}</option>
			);

			list = this.props.appStore.playlistCreatorReducer.defaultPlaylist[playlistKeys[this.state.playlistItemsGroupId]].sort().map((playlistItems) =>
				<PlaylistItem key={playlistItems.id} item={playlistItems} />
			);
		}

		return (
			<div 
			className="list_block default_playlist col" 
			ref="scrollBlock"
			onDragOver={this.onDragOver}
				onDrop={this.onDrop.bind(this)}>
				{this.state.isLoading ? <Loading /> : (
					<Fragment>
						<select value={Object.keys(this.props.appStore.playlistCreatorReducer.defaultPlaylist)[this.state.playlistItemsGroupId]} onChange={this.changePlaylistGroup.bind(this)}>
							{groupOptions}
						</select>
						<ul className="list">
							{list}
						</ul>
					</Fragment>
				)}
			</div>
		);
	}
}

export default connect(
	state => ({ appStore: state }),
	dispatch => ({
		onSetDefaultPlaylist: (newDefaultPlaylist) => {
			dispatch({ type: 'SET_DEFAULT_PLAYLIST', payload: newDefaultPlaylist })
		},
		onMovePlaylistItemToDefaultPlaylist: (item) => {
			dispatch({ type: 'ADD_ITEM_TO_DEFAULT_PLAYLIST', payload: item });
		}
	})
)(DefaultPlaylist);
