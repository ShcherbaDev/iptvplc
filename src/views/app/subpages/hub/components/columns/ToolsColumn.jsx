import React, { Component } from 'react';

class ToolsColumn extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="list-group list-group-flush">
				<button className="list-group-item list-group-item-action create" onClick={this.props.onCreateNewPlaylistButtonClick}>
					<i className="fas fa-plus"></i>
					Создать новый плейлист
				</button>
				<button className="list-group-item list-group-item-action open" onClick={this.props.onOpenPlaylistFileDialog}>
					<i className="fas fa-folder-open"></i>
					Открыть плейлист с устройства
				</button>
			</div>
		);
	}
}

export default ToolsColumn;
