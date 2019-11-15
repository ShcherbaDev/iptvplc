import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'components/Modal/Modal';
import Card from 'components/Card/Card';
import Loading from 'components/Loading/Loading';

import HubColumn from './components/HubColumn';
import ToolsColumn from './components/columns/ToolsColumn';
import RecentPlaylistsColumn from './components/columns/RecentPlaylistsColumn';

import isUserLoggedIn from 'assets/js/isUserLoggedIn';
import fetchApi from 'assets/js/fetchApi';
import parseM3U from 'assets/js/parseM3U';
import isPlaylistMimeTypeValid from 'assets/js/isPlaylistMimeTypeValid';

class Hub extends Component {
	constructor(props) {
		super(props);

		this.state = {
			recentPlaylists: [],
			isRecentPlaylistsLoading: true,

			showDragAndDropWindow: false,

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
				this.createPlaylistRequest(loggedInData.id, `${inputValue.value}.m3u`, 'data:audio/x-mpegurl;');
			});
		}
		else {
			inputValue.focus();
		}
	}

	openPlaylistFileDialog() {
		document.getElementById('playlistFileDialog').click();
	}

	createPlaylistModalResponse(response) {
		this.onModalClose();
		switch (response.status) {
			case 201:
				return response.json();
			
			case 400:
				this.setState({
					isModalOpen: true,
					modalContent: (
						<p>Расширение плейлиста должно быть <samp>.m3u</samp> или <samp>.m3u8</samp></p>
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
						<p>Во время создания плейлиста произошла ошибка!<br/>Пожалуйста, попробуйте ещё раз.</p>
					),
					modalData: {
						...this.state.modalData,
						title: 'Ошибка!'
					}
				});
				break;
		}
	}

	createPlaylistRequest(authorId, fileName, fileData) {
		if (/\.m3u8?$/.test(fileName)) {
			fetch(`${window.location.origin}/api/createPlaylist`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user_id: authorId,
					file_name: fileName,
					file_data: fileData
				})
			})
			.then(response => {
				return this.createPlaylistModalResponse(response);
			})
			.then(response => {
				return this.props.onSetPlaylistData(response.newPlaylistId);
			});
		}
		else {
			this.setState({
				isModalOpen: true,
				modalContent: (
					<p>Расширение плейлиста должно быть <samp>.m3u</samp> или <samp>.m3u8</samp></p>
				),
				modalData: {
					...this.state.modalData,
					title: 'Ошибка!'
				}
			});
		}
	}

	onOpenPlaylist(event) {
		const { name, type } = event.target.files[0];
		
		if (isPlaylistMimeTypeValid(type)) {
			let reader = new FileReader();

			reader.addEventListener('load', file => {
				isUserLoggedIn().then((loggedInData) => {
					this.createPlaylistRequest(loggedInData.id, name, file.target.result);
				});
			});

			reader.readAsDataURL(event.target.files[0]);
		}
		else {
			this.onModalClose();
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
			console.error(`Unknown MIME type of file!`);
		}
	}

	onLoadAppData(playlistId, event) {
		if (
			event.target.nodeName === 'DIV'
			|| (event.target.offsetParent.nodeName === 'DIV'
				&& event.target.offsetParent.className.includes('playlist-item'))
		) {
			this.props.onSetPlaylistData(playlistId);
		}
	}

	renamePlaylistRequest(playlistId) {
		const playlists = this.state.recentPlaylists;
		const requestedPlaylistIndex = playlists.findIndex(item => item.id === playlistId);
		const playlistFilenameData = playlists[requestedPlaylistIndex].filename.split(/\./);

		this.setState({
			isModalOpen: true,
			modalContent: (
				<div className="form-group">
					<label htmlFor="playlistNewNameInput">Новое имя плейлиста:</label>
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							id="playlistNewNameInput"
							defaultValue={playlistFilenameData[0]}
							maxLength="255" />
						<div className="input-group-append">
							<span className="input-group-text">{playlistFilenameData[playlistFilenameData.length-1] !== playlistFilenameData[0] ? playlistFilenameData[playlistFilenameData.length-1] : '.m3u'}</span>
						</div>
					</div>
				</div>
			),
			modalData: {
				...this.state.modalData,
				style: {
					width: '78vw'
				},
				title: 'Имя нового плейлиста',
				footer: (
					<button className="btn btn-block btn-outline-success" onClick={this.onRenamePlaylist.bind(this, playlistId)}>Переименовать</button>
				)
			}
		});
	}

	onRenamePlaylist(playlistId) {
		const inputValue = document.getElementById('playlistNewNameInput');

		const playlists = this.state.recentPlaylists;
		const requestedPlaylistIndex = playlists.findIndex(item => item.id === playlistId);
		const playlistFilenameData = playlists[requestedPlaylistIndex].filename.split(/\./);
		const playlistExtension = playlistFilenameData[playlistFilenameData.length-1];

		if (inputValue.value !== '') {
			isUserLoggedIn().then(async () => {
				fetch(`${window.location.origin}/api/renamePlaylist`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id: playlistId,
						newPlaylistName: `${inputValue.value}.${playlistExtension === inputValue.value ? 'm3u' : playlistExtension}`
					})
				})
				.then(response => {
					this.onModalClose();

					switch (response.status) {
						case 200:
							this.setState({
								isModalOpen: true,
								modalContent: (
									<p>Плейлист "<samp>{playlists[requestedPlaylistIndex].filename}</samp>" был успешно переименован!</p>
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
									<p>Во время переименования плейлиста произошла ошибка!<br/>Пожалуйста, попробуйте ещё раз.</p>
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
			});
		}
		else {
			inputValue.focus();
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
		fetch(`${window.location.origin}/api/deletePlaylist`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: playlistId
			})
		})
		.then(response => {
			this.onModalClose();

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

	onDropCapture(e) {
		e.preventDefault();

		const files = e.dataTransfer.files;
		
		this.setState({ showDragAndDropWindow: false });

		isUserLoggedIn().then(async () => {
			const formData = new FormData();

			formData.append('file', files[0]);

			const req = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});
			const res = await this.createPlaylistModalResponse(req);
			this.props.onSetPlaylistData(res.newPlaylistId);
		});
	}

	render() {
		return (
			<>
				<div className="content container">
					{!this.state.isRecentPlaylistsLoading ? (
						<Card bodyStyle={{ display: 'inline-flex' }}>
							<div
								className="row w-100"
								onDragOver={(e) => {
									e.preventDefault();
									this.setState({ showDragAndDropWindow: true });
								}}
								onDragLeave={(e) => {
									e.preventDefault();
									this.setState({ showDragAndDropWindow: false });
								}}
								onDropCapture={this.onDropCapture.bind(this)}
							>
								{!this.state.showDragAndDropWindow ? (
									<>
										{this.state.recentPlaylists.length > 0 && (
											<HubColumn title="Предыдущие плейлисты:" className="recent h-100 d-flex flex-column col-12 col-lg-6 mt-2 mt-lg-0 order-1 order-lg-0">
												<RecentPlaylistsColumn
													recentPlaylists={this.state.recentPlaylists}
													onLoadAppData={this.onLoadAppData.bind(this)}

													deletePlaylistRequest={this.deletePlaylistRequest.bind(this)}
													renamePlaylistRequest={this.renamePlaylistRequest.bind(this)} />
											</HubColumn>
										)}

										<HubColumn className={`tools align-self-center ${this.state.recentPlaylists.length > 0 ? 'col-12 col-lg-6' : 'text-center col-12'} order-0 order-lg-1`}>
											<ToolsColumn
												onCreateNewPlaylistButtonClick={this.onCreateNewPlaylistButtonClick}
												onOpenPlaylistFileDialog={this.openPlaylistFileDialog} />
										</HubColumn>
									</>
								) : (
									<div className="dropzone" style={{
										border: '2px dashed #ccc',
										width: '100%',
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										padding: '13% 0'
									}}>
										<i className="fas fa-upload" style={{ fontSize: 50, marginBottom: 12 }}></i>
										Переместите сюда необходимый файл для редактирования
										<small>Поддерживаются форматы .m3u и .m3u8</small>
									</div>
								)}
							</div>
						</Card>
					) : <Loading />}
				</div>
				
				<input
					type="file"
					accept=".m3u,.m3u8"
					style={{ display: 'none' }}
					id="playlistFileDialog"
					onChange={this.onOpenPlaylist} />

				{this.state.isModalOpen && <Modal {...this.state.modalData}>{this.state.modalContent}</Modal>}
			</>
		);
	}
}

export default connect(
	state => ({ appStore: state }),
	dispatch => ({
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
