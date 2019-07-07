import React, { Component } from 'react';
import { connect } from 'react-redux';

class PlaylistItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			playlistItemPreviewSrc: './images/nopic.jpg'
		};

		this.domObj = React.createRef();
	}

	onDragStart(event) {
		event.dataTransfer.setData('playlistItem', JSON.stringify(this.props.item));
	}

	onSelectPlaylistItem(event) {
		this.props.onSelect(this.props.item.id);
	}

	render() {
		const playlistItem = this.props.item;
		
		let playlistItemPreview;

		playlistItemPreview = <img src={this.props.item.inf.icon} alt={'\"' + playlistItem.inf.title + '\" preview'}/>;

		return (
			<li
				className={`playlist_item${this.props.appStore.playlistCreatorReducer.selectedPlaylistItems === this.props.item.id ? ' selected' : ''}`} 
				ref={this.domObj}
				draggable="true"
				onDragStart={this.onDragStart.bind(this)}
				onClick={this.onSelectPlaylistItem.bind(this)}>
				<div className="channel_preview">
					{playlistItemPreview}
				</div>
				<div className="channel_title">
					{playlistItem.inf.title}
				</div>
			</li>
		);
	}
}

export default connect(
	state => ({ appStore: state }),
	dispatch => ({
		onSelect: (itemId) => {
			dispatch({ type: 'SELECT_ITEM', payload: itemId })
		}
	})
)(PlaylistItem);
