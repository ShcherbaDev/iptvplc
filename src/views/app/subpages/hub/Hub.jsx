import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Modal from '../../../../components/Modal/Modal';
import Card from '../../../../components/Card/Card';
import HubColumn from './components/HubColumn';
import Loading from '../../../../components/Loading/Loading';

import isUserLoggedIn from '../../../../assets/js/isUserLoggedIn';
import fetchApi from '../../../../assets/js/fetchApi';
import parseM3U from '../../../../assets/js/parseM3U';
import ToolsColumn from './components/columns/ToolsColumn';
import RecentPlaylistsColumn from './components/columns/RecentPlaylistsColumn';

class Hub extends Component {
	constructor(props) {
		super(props);

		this.state = {
			recentPlaylists: [],
			isRecentPlaylistsLoading: true,
			acceptedPlaylistExtension: 'audio/x-mpegurl',

			isModalOpen: false,
			modalContent: '',
			modalData: {
				title: undefined,
				footer: undefined,
				onClose: this.onModalClose.bind(this),
				style: {}
			}
		};

		this.createPlaylist = this.createPlaylist.bind(this);
		this.onCreateNewPlaylistButtonClick = this.onCreateNewPlaylistButtonClick.bind(this);
		this.onOpenPlaylist = this.onOpenPlaylist.bind(this);
	}

	componentDidMount() {
		isUserLoggedIn()
			.then(async (loggedInData) => {
				if (loggedInData.isLoggedIn) {
					const userRecentPlaylists = await fetchApi(`user/${loggedInData.id}/playlists`);
					this.setState({
						recentPlaylists: userRecentPlaylists,
						isRecentPlaylistsLoading: false
					});
				}
			});
	}

	onModalClose() {
		this.setState({
			isModalOpen: false,
			modalContent: '',
			modalData: {
				title: undefined,
				footer: undefined,
				onClose: this.onModalClose.bind(this),
				style: {}
			}
		});
	}

	clearModalData() {
		this.setState({
			isModalOpen: false,
			modalContent: '',
			modalData: {
				title: undefined,
				footer: undefined,
				onClose: this.onModalClose.bind(this),
				style: {}
			}
		});
	}

	onCreateNewPlaylistButtonClick() {
		const playlistNameExamples = [
			'Спортивный плейлист',
			'Образовательный плейлист',
			'Новостной плейлист'
		];

		const randomPlaylistNamePlaceholder = playlistNameExamples[Math.floor(Math.random()*playlistNameExamples.length)]

		this.setState({
			isModalOpen: true,
			modalContent: (
				<div className="form-group">
					<label htmlFor="playlistNameInput">Название плейлиста:</label>
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							id="playlistNameInput"
							placeholder={"Например: " + randomPlaylistNamePlaceholder}
							maxLength="255" />
						<div className="input-group-append">
							<span className="input-group-text">.m3u</span>
						</div>
					</div>
				</div>
			),
			modalData: {
				...this.state.modalData,
				style: {
					width: '78vw'
				},
				title: 'Настройки нового плейлиста',
				footer: (
					<button className="btn btn-block btn-outline-success" onClick={this.createPlaylist}>Создать</button>
				)
			}
		});
	}

	createPlaylist() {
		const inputValue = document.getElementById('playlistNameInput');
		if (inputValue.value !== '') {
			isUserLoggedIn().then((loggedInData) => {
				this.createPlaylistRequest(loggedInData.id, inputValue.value, 'data:audio/x-mpegurl;');
			});
		}
		else {
			inputValue.focus();
		}
	}

	openPlaylistFileDialog() {
		document.getElementById('playlistFileDialog').click();
	}

	createPlaylistRequest(authorId, filename, filedata) {
		fetch('/api/createPlaylist', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: authorId,
				filename: filename.concat(!/\.m3u$/.test(filename) ? '.m3u' : ''),
				filedata
			})
		})
		.then(response => {
			this.clearModalData();
			switch (response.status) {
				case 201:
					return response.json()
				
				case 400:
					this.setState({
						isModalOpen: true,
						modalContent: (
							<p>Расширение плейлиста должно быть <samp>.m3u</samp></p>
						),
						modalData: {
							...this.state.modalData,
							title: 'Ошибка!'
						}
					});
					break;
				
				default:
					this.setState({
						isModalOpen: true,
						modalContent: (
							<Fragment>
								<p>Во время создания плейлиста произошла ошибка!<br/>Пожалуйста, попробуйте ещё раз.</p>
								<p>Информация об ошибке: {err}</p>
							</Fragment>
						),
						modalData: {
							...this.state.modalData,
							title: 'Ошибка!'
						}
					});
					break;
			}
		})
		.then(response => {
			this.props.onSetPlaylistData(response.newPlaylistId);
		})
	}

	onOpenPlaylist(event) {
		const { name, type } = event.target.files[0];

		if (type === this.state.acceptedPlaylistExtension) {
			let reader = new FileReader();

			reader.addEventListener('load', file => {
				isUserLoggedIn().then((loggedInData) => {
					this.createPlaylistRequest(loggedInData.id, name, file.target.result);
				});
			});

			reader.readAsDataURL(event.target.files[0]);
		}
		else {
			this.clearModalData();
			this.setState({
				isModalOpen: true,
				modalContent: (
					<p>Расширение плейлиста должно быть <samp>.m3u</samp></p>
				),
				modalData: {
					...this.state.modalData,
					title: 'Ошибка!'
				}
			});
			console.error(`MIME type of playlist file should be ${this.state.acceptedPlaylistExtension}`);
		}
	}

	onLoadAppData(playlistId, event) {
		if (event.target.nodeName === 'DIV') {
			this.props.onSetPlaylistData(playlistId);
		}
	}

	deletePlaylistRequest(playlistId) {
		const playlists = this.state.recentPlaylists;
		const requestedPlaylistIndex = playlists.findIndex(item => item.id === playlistId);

		this.setState({
			isModalOpen: true,
			modalContent: (
				<p>Вы уверены, что хотите удалить плейлист "<samp>{playlists[requestedPlaylistIndex].filename}</samp>"</p>
			),
			modalData: {
				...this.state.modalData,
				title: 'Внимание!',
				footer: (
					<button className="btn btn-block btn-outline-success" onClick={this.onDeletePlaylist.bind(this, playlistId)}>Да</button>
				),
				style: {
					width: '44vw'
				}
			}
		});
	}

	onDeletePlaylist(playlistId) {
		fetch('/api/deletePlaylist', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: playlistId
			})
		})
		.then(response => {
			this.clearModalData();

			switch (response.status) {
				case 200:
					const playlists = this.state.recentPlaylists;
					const requestedPlaylistIndex = playlists.findIndex(item => item.id === playlistId);

					this.setState({
						isModalOpen: true,
						modalContent: (
							<p>Плейлист "<samp>{playlists[requestedPlaylistIndex].filename}</samp>" был успешно удалён!</p>
						),
						modalData: {
							...this.state.modalData,
							title: 'Внимание!',
							footer: (
								<button className="btn btn-block btn-outline-success" onClick={() => location.reload()}>Ок</button>
							),
							onClose: undefined,
							style: {
								width: '44vw'
							}
						}
					});
					break;
				
				default:
					this.setState({
						isModalOpen: true,
						modalContent: (
							<p>Во время удаления плейлиста произошла ошибка!<br/>Пожалуйста, попробуйте ещё раз.</p>
						),
						modalData: {
							...this.state.modalData,
							title: 'Ошибка!',
							footer: (
								<button className="btn btn-block btn-outline-success" onClick={this.onModalClose.bind(this)}>Ок</button>
							),
							style: {
								width: '44vw'
							}
						}
					});
					break;
			}
		});
	}

	render() {
		const recentPlaylists = this.state.recentPlaylists.map(item =>
			<div className="list-group-item list-group-item-action"
				key={item.id.toString()}
				onClick={e => this.onLoadAppData(item.id, e)}>
				{item.filename}<br/>
				Дата создания: {new Date(item.creation_date).toLocaleDateString('ru-RU', {
					dateStyle: 'medium'
				})}<br/>
				Дата последнего изменения: {new Date(item.last_edit_date).toLocaleDateString('ru-RU', {
					dateStyle: 'medium'
				})}

				<button onClick={this.deletePlaylistRequest.bind(this, item.id)} 
					style={{ position: "absolute", top: 0, right: 0 }}
					className="btn btn-black">
					<i className="fas fa-times"></i>
				</button>
			</div>
		);

		return (
			<Fragment>
				<div className="content container">
					{!this.state.isRecentPlaylistsLoading ? (
						<Card>
							<div className="container-fluid">
								<div className="row">
									{recentPlaylists.length > 0 && <RecentPlaylistsColumn recentPlaylists={recentPlaylists} />}
									<ToolsColumn
										onCreateNewPlaylistButtonClick={this.onCreateNewPlaylistButtonClick}
										onOpenPlaylistFileDialog={this.openPlaylistFileDialog} />
								</div>
							</div>
						</Card>
					) : <Loading />}
				</div>
				
				<input
					type="file"
					accept={this.state.acceptedPlaylistExtension}
					style={{ display: 'none' }}
					id="playlistFileDialog"
					onChange={this.onOpenPlaylist} />

				{this.state.isModalOpen && <Modal {...this.state.modalData}>{this.state.modalContent}</Modal>}
			</Fragment>
		);
	}
}

export default connect(
	state => ({ appStore: state }),
	dispatch => ({
		setAppSubpage: newSubpage => {
			dispatch({
				type: 'SET_APP_SUBPAGE',
				payload: newSubpage
			});
		},

		onSetPlaylistData: playlistId => {
			dispatch({
				type: 'SET_APP_SUBPAGE',
				payload: 'editor'
			});

			fetch(`/api/playlist/${playlistId}`, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(response => {
					switch (response.status) {
						case 200:
							return response.json();
						
						default:
							throw new Error(response.status);
					}
				})
				.then(response => {
					const parsedResponse = parseM3U(response.data);
					dispatch({
						type: 'SET_PLAYLIST',
						payload: {
							...response,
							data: parsedResponse,
							isEmpty: parsedResponse.length < 1
						}
					});
				})
		}
	})
)(Hub);
