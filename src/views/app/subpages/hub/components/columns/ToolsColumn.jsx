import React, { Component } from 'react';

import HubColumn from '../HubColumn';

class ToolsColumn extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<HubColumn className="tools align-self-center">
				<div className="list-group list-group-flush">
					<button className="list-group-item list-group-item-action create" onClick={this.props.onCreateNewPlaylistButtonClick}>
						<i className="fas fa-plus"></i>
						Создать чистый плейлист
					</button>
					<button className="list-group-item list-group-item-action open" onClick={this.props.onOpenPlaylistFileDialog}>
						<i className="fas fa-folder-open"></i>
						Открыть локальный плейлист
					</button>
				</div>
			</HubColumn>
		);
	}
}

export default ToolsColumn;
