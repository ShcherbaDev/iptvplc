import React, { Component } from 'react';

import Search from '../../../../../../components/Search/Search';

class RecentPlaylistsColumn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filteredRecentPlaylistsList: []
		};
	}

	componentDidMount() {
		this.setState({
			filteredRecentPlaylistsList: this.props.recentPlaylists
		});
	}

	doSearch(event) {
		const val = event.target.value;
		const { recentPlaylists } = this.props;

		let currentList = [];
		let newList = [];

		if (val !== '') {
			currentList = recentPlaylists;
			newList = currentList.filter(item => item.filename.includes(val));
		} 
		else {
			newList = recentPlaylists;
		}

		this.setState({
			filteredRecentPlaylistsList: newList
		});
	}

	render() {
		const recentPlaylistsList = this.state.filteredRecentPlaylistsList.map(item =>
			<div className="playlist-item list-group-item list-group-item-action"
				key={item.id.toString()}
				onClick={e => this.props.onLoadAppData(item.id, e)}>

				<span className="d-block text-truncate" style={{ maxWidth: '85%' }}>{item.filename}</span>

				Создан: {new Date(item.creation_date).toLocaleDateString('ru-RU', {
					dateStyle: 'medium'
				})}<br/>
				Изменён: {new Date(item.last_edit_date).toLocaleDateString('ru-RU', {
					dateStyle: 'medium'
				})}

				<div className="playlist-tools" style={{ position: 'absolute', top: 0, right: 0 }}>
					<button onClick={this.props.renamePlaylistRequest.bind(this, item.id)}
						className="btn btn-black"
						title="Переименовать плейлист">
						<i className="fas fa-pencil-alt"></i>
					</button>
					<button onClick={this.props.deletePlaylistRequest.bind(this, item.id)}
						className="btn btn-black"
						title="Удалить плейлист">
						<i className="fas fa-trash-alt"></i>
					</button>
				</div>
			</div>
		);

		return (
			<>
				<Search onChange={this.doSearch.bind(this)} placeholder="Поиск по названию плейлиста..." />

				<div className="list-group list-group-flush overflow-auto" >
					{recentPlaylistsList.length ? recentPlaylistsList : <p className="mt-1 mb-0 text-center">Ничего не было найдено!</p>}
				</div>
			</>
		);
	}
}

export default RecentPlaylistsColumn;
