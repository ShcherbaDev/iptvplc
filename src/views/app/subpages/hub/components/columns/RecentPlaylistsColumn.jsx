import React, { Component } from 'react';

import HubColumn from '../HubColumn';

class RecentPlaylistsColumn extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<HubColumn title="Предыдущие плейлисты:" className="recent">
				<div className="list-group list-group-flush">
					{this.props.recentPlaylists}
				</div>
			</HubColumn>
		);
	}
}

export default RecentPlaylistsColumn;
