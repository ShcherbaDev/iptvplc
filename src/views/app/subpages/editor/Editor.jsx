import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import encodeM3U from '../../../../assets/js/encodeM3U';

import './Editor.scss';

import Search from '../../../../components/Search/Search';
import Modal from '../../../../components/Modal/Modal';
import Card from '../../../../components/Card/Card';
import Loading from '../../../../components/Loading/Loading';

import SimpleChannel from './components/addPlaylistItemModals/SimpleChannel'; 
import YoutubeVideoModal from './components/addPlaylistItemModals/YoutubeVideo/YoutubeVideo';
import ImageModal from './components/addPlaylistItemModals/Image/Image';
import isObjectEmpty from '../../../../assets/js/isObjectEmpty';

class Editor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			imageThumbnail: '',
			isAddBtnDisabled: true,

			playlist: {},

			isModalOpen: false,
			modalContent: '',
			modalData: {
				title: undefined,
				footer: undefined,
				onClose: this.onModalClose.bind(this),
				style: {}
			}
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (isObjectEmpty(state.playlist)) {
			state = {
				...state,
				playlist: {
					...props.playlist,
					filteredPlaylistData: props.playlist.data
				}
			};
		}
		
		return state;
	}

	onModalClose() {
		this.setState({
			isModalOpen: false
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

	togglePlaylistItemActive(playlistItemId, isCtrlKeyPressed) {
		if (!isCtrlKeyPressed) {
			this.props.onTogglePlaylistItemActive(playlistItemId);

			const newData = {
				...this.state.playlist.data[this.state.playlist.data.findIndex(item => item.active)],
				active: !this.state.playlist.data[this.state.playlist.data.findIndex(item => item.active)].active
			};

			
		}
	}

	addPlaylistItemRequest(type) {
		this.clearModalData();

		switch (type) {
			case 'simpleChannel':
				this.setState({
					isModalOpen: true,
					modalContent: <SimpleChannel />,
					modalData: {
						...this.state.modalData,
						title: 'Добавить новый канал',
						footer: (
							<button
								className="btn btn-block btn-outline-success"
								onClick={() => {
									const iconUrlRegex = /(https?:\/\/.*\.(?:png|jpg|gif|svg|webp))/i;
									const channelUrlRegex = /^https?:\/\/([\w\d\-]+\.)+\w{2,}(\/.+)?$/;

									if (
										this.props.appStore.previewData.name !== ''
										&& iconUrlRegex.test(this.props.appStore.previewData.icon)
										&& channelUrlRegex.test(this.props.appStore.previewData.url)
									) {
										this.props.onAddPlaylistItem(
											this.props.appStore.previewData.name,
											this.props.appStore.previewData.icon,
											this.props.appStore.previewData.url,
											'simpleChannel'
										);
										this.clearModalData();
										this.props.onClearPreviewData();
									}
									else {
										if (this.props.appStore.previewData.name === '') 
											document.getElementById('channelName').focus();

										if (!iconUrlRegex.test(this.props.appStore.previewData.icon)) 
											document.getElementById('channelIcon').focus();

										if (!channelUrlRegex.test(this.props.appStore.previewData.url))
											document.getElementById('channelUrl').focus();
									}
								}}>Добавить</button>
						),
						onClose: () => {
							this.onModalClose();
							this.props.onClearPreviewData();
						}
					}
				});
				break;

			case 'youtube':
				this.setState({
					isModalOpen: true,
					modalContent: <YoutubeVideoModal />,
					modalData: {
						...this.state.modalData,
						title: 'Добавить видео с Youtube',
						footer: (
							<button
								className="btn btn-block btn-outline-success"
								onClick={
									() => {
										if (this.props.appStore.previewData.url !== '') {
											this.props.onAddPlaylistItem(
												this.props.appStore.previewData.name,
												this.props.appStore.previewData.icon,
												this.props.appStore.previewData.url,
												'youtube'
											);
											this.clearModalData();
											this.props.onClearPreviewData();
										}
										else document.getElementById('youtubeVideoUrl').focus();
									}
								}>Добавить</button>
						),
						onClose: () => {
							this.onModalClose();
							this.props.onClearPreviewData();
						}
					}
				});
				break;

			case 'image':
				this.setState({
					isModalOpen: true,
					modalContent: <ImageModal />,
					modalData: {
						...this.state.modalData,
						title: 'Добавить картинку',
						footer: (
							<button
								className="btn btn-block btn-outline-success"
								onClick={() => {
									const iconUrlRegex = /(https?:\/\/.*\.(?:png|jpg|gif|svg|webp))/i;
									if (iconUrlRegex.test(this.props.appStore.previewData.url)) {
										this.props.onAddPlaylistItem(
											this.props.appStore.previewData.name,
											this.props.appStore.previewData.icon,
											this.props.appStore.previewData.url,
											'image'
										);
										this.clearModalData();
										this.props.onClearPreviewData();
									}
									else document.getElementById('imageUrl').focus();
								}}>Добавить</button>
						),
						onClose: () => {
							this.onModalClose();
							this.props.onClearPreviewData();
						}
					}
				});
				break;
		}
	}

	savePlaylist() {
		const { id, data } = this.props.appStore.playlist;

		this.clearModalData();
		this.setState({
			isModalOpen: true,
			modalContent: <Loading />,
			modalData: {
				title: 'Сохранение плейлиста...',
				onClose: undefined
			}
		});
		
		fetch(`${window.location.origin}/api/savePlaylist`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				playlist_id: id,
				new_data: encodeM3U(data)
			})
		})
			.then(response => {
				switch (response.status) {
					case 200:
						return response.text();

					default:
						this.setState({
							isModalOpen: true,
							modalContent: (
								<p>При сохранении плейлиста произошла ошибка!<br/>Пожалуйста, попробуйте ещё раз!</p>
							),
							modalData: {
								title: 'Ошибка!',
								footer: undefined,
								onClose: this.onModalClose.bind(this),
								style: {
									width: '44vw'
								}
							}
						});
						break;
				}
			})
			.then(response => {
				this.setState({
					isModalOpen: true,
					modalContent: (
						<p>Сохранено!</p>
					),
					modalData: {
						title: 'Сохранение плейлиста прошло успешно!',
						footer: (
							<a className="btn btn-block btn-outline-success" href={response} download={this.props.appStore.playlist.filename}>Скачать</a>
						),
						onClose: this.onModalClose.bind(this),
						style: {
							width: '44vw'
						}
					}
				});
			});
	}

	backToHubModalOpen() {
		this.clearModalData();
		this.setState({
			isModalOpen: true,
			modalContent: (
				<p className="mb-0">
					Вы уверены, что хотите вернуться к списку плейлистов?<br />
					Все несохраненные изменения будут утеряны.
				</p>
			),
			modalData: {
				title: 'Внимание!',
				footer: (
					<a className="btn btn-block btn-outline-success" href="/app">Ок</a>
				),
				onClose: this.onModalClose.bind(this),
				style: {
					width: '44vw'
				}
			}
		});
	}

	deletePlaylistItemConfirmModal() {
		const activePlaylistItems = this.props.playlist.data.findIndex(it => it.active);

		this.clearModalData();
		this.setState({
			isModalOpen: true,
			modalContent: (
				<p className="mb-0">
					Вы уверены, что хотите удалить "{this.props.playlist.data[activePlaylistItems].name}"?
				</p>
			),
			modalData: {
				title: 'Внимание!',
				footer: (
					<button className="btn btn-block btn-outline-success" onClick={() => {
						this.props.onDeletePlaylistItem(this.props.playlist.data[activePlaylistItems].id);
						this.onModalClose();
					}}>Да</button>
				),
				onClose: this.onModalClose.bind(this),
				style: {
					width: '44vw'
				}
			}
		});
	}

	doSearch(event) {
		const val = event.target.value;
		const playlistData = this.state.playlist.data;

		let currentList = [];
		let newList = [];

		if (val !== '') {
			currentList = playlistData;
			newList = currentList.filter(item => item.name.includes(val));
		} 
		else {
			newList = playlistData;
		}

		this.setState({
			playlist: {
				...this.state.playlist,
				filteredPlaylistData: newList
			}
		});
	}

	render() {
		const { playlist } = this.state;
		const { filteredPlaylistData } = playlist;

			const playlistItems = filteredPlaylistData.length > 0 && filteredPlaylistData.map(item => {
				return (
					<button
						className={`list-group-item list-group-item-action${item.active ? ' active' : ''}`}
						key={item.id.toString()}
						style={{
							padding: "0 5px 0 0",
							overflow: "hidden",
							whiteSpace: "nowrap",
							textOverflow: "ellipsis"
						}}
						onClick={e => this.togglePlaylistItemActive(item.id, e.ctrlKey)}>
						<img src={item.icon || '/static/images/nopic.jpg'}
							alt={`Иконка ${item.name}`}
							onError={(e) => e.target.src = '/static/images/nopic.jpg'}
							style={{
								width: 64,
								height: 64,
								objectFit: "cover",
								marginRight: 8
							}}/>
						{item.name}
					</button>
				);
			});

			const activePlaylistItems = filteredPlaylistData.findIndex(it => it.active);

			const simpleChannelSettings = activePlaylistItems !== -1 && (
				<>
					<div className="form-group">
						<label htmlFor="channelName">Название канала:</label>
						<input type="text" className="form-control" id="channelName" 
							value={filteredPlaylistData[activePlaylistItems].name}
							onChange={e => this.props.onChangePlaylistItem(activePlaylistItems, 'name', e.target.value)} />
					</div>
					<div className="form-group">
						<label htmlFor="channelIcon">URL иконки:</label>
						<input type="url" className="form-control" id="channelIcon" 
							value={filteredPlaylistData[activePlaylistItems].icon}
							onChange={e => {
								this.props.onChangePlaylistItem(activePlaylistItems, 'icon', e.target.value);
							}} />
					</div>
					<div className="form-group">
						<label htmlFor="channelUrl">URL:</label>
						<input type="url" className="form-control" id="channelUrl"
							value={filteredPlaylistData[activePlaylistItems].url}
							onChange={e => {
								this.props.onChangePlaylistItem(activePlaylistItems, 'url', e.target.value);
							}} />
					</div>
				</>
			);

			const youtubeVideoSettings = activePlaylistItems !== -1 && (
				<div className="form-group">
					<label htmlFor="youtubeVideoUrl">URL видео:</label>
					<input type="url" id="youtubeVideoUrl" className="form-control"
						placeholder="https://youtube.com/..."
						value={filteredPlaylistData[activePlaylistItems].url}
						onChange={e => this.props.onChangeYoutubePlaylistItem(activePlaylistItems, e.target.value)} />
				</div>
			);

			const imageSettings = activePlaylistItems !== -1 && (
				<div className="form-group">
					<label htmlFor="imageUrl">URL картинки:</label>
					<input type="url" id="imageUrl" className="form-control"
						value={filteredPlaylistData[activePlaylistItems].url}
						onChange={e => this.props.onChangeImagePlaylistItem(activePlaylistItems, e.target.value)} />
				</div>
			);

			return (
				<>
					<div className="container content">
						<Card bodyStyle={{ padding: 0 }}>
							<div className="grid-container" style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gridTemplateRows: '0fr 1fr',
								gridTemplateAreas: `"buttons settings" "list settings"`,
								overflowY: 'auto',
								height: '65vh'
							}}>
								<div className="buttons" style={{
									gridArea: 'buttons',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
									padding: '0 14px',
									backgroundColor: 'rgba(22, 22, 22, .3)'
								}}>
									<div className="left-part">
										<button type="button" className="btn btn-dark" onClick={this.backToHubModalOpen.bind(this)} title="Вернутся к списку плейлистов">
											<i className="fas fa-arrow-left"></i>
										</button>
										<div className="btn-group ml-3">
											<button type="button" className="btn btn-dark" onClick={() => this.addPlaylistItemRequest('simpleChannel')} title="Добавить новый элемент плейлиста">
												<i className="fas fa-plus"></i>
											</button>
											<button type="button" className="btn btn-dark" onClick={() => this.addPlaylistItemRequest('youtube')} title="Добавить в плейлист видео с Youtube">
												<i className="fab fa-youtube"></i>
											</button>
											<button type="button" className="btn btn-dark" onClick={() => this.addPlaylistItemRequest('image')} title="Добавить изображение в плейлист">
												<i className="fas fa-image"></i>
											</button>
										</div>
									</div>
									<button type="button" className="btn btn-dark" onClick={this.savePlaylist.bind(this)} title="Сохранить плейлист">
										<i className="fas fa-save"></i>
									</button>
								</div>
								<div className="list" style={{
									gridArea: "list",
									overflowY: "auto",
									overflowX: "hidden"
								}}>
									{this.state.playlist.data.length > 0 ? (
										<>
											<div className="search-container mx-3">
												<Search onChange={this.doSearch.bind(this)} placeholder="Поиск по названию элемента плейлиста..." />
											</div>
											<div className="list-group list-group-flush" style={{ padding: 8 }}>
												{playlistItems}
											</div>
										</>
									) : (
										<p style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											height: "100%",
											marginBottom: 0,
											textAlign: "center"
										}}>На данный момент плейлист пуст!</p>
									)}
								</div>
								<div className="settings" style={{
									gridArea: "settings",
									overflowY: "auto",
									padding: "8px 14px",
									backgroundColor: "rgba(22, 22, 22, .3)",
									borderLeft: "1px solid #555"
								}}>
									{activePlaylistItems !== -1 ? (
										<>
											{(() => {
												switch (filteredPlaylistData[activePlaylistItems].type) {
													case 'simpleChannel':
														return simpleChannelSettings;
		
													case 'youtube':
														return youtubeVideoSettings;
		
													case 'image':
														return imageSettings;
												
													default:
														return simpleChannelSettings;
												}
											})()}
											
											<button className="btn btn-dark" onClick={this.deletePlaylistItemConfirmModal.bind(this)} title="Удалить элемент плейлиста">
												<i className="fas fa-trash-alt"></i>
											</button>
										</>
									) : <p style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "100%",
										marginBottom: 0,
										textAlign: "center"
									}}>Ничего не выбрано для редактирования!</p>}
								</div>
							</div>
						</Card>
					</div>
					{this.state.isModalOpen && <Modal {...this.state.modalData}>{this.state.modalContent}</Modal>}
				</>
			);
	}
}

export default connect(
	state => ({ appStore: state.appReducer }),
	dispatch => ({
		onTogglePlaylistItemActive(id) {
			dispatch({
				type: 'TOGGLE_PLAYLIST_ITEM_ACTIVE',
				payload: id
			});
		},

		onChangePlaylistItem(playlistItemIndex, key, newValue) {
			dispatch({
				type: 'CHANGE_PLAYLIST_ITEM',
				payload: {
					playlistItemIndex, key, newValue
				}
			});
		},

		onChangeYoutubePlaylistItem(playlistItemIndex, videoUrl) {
			const regex = /youtube\.com.*(\?v=|\/embed\/)(.{11})/;
			if (regex.test(videoUrl)) {
				fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoUrl.match(regex).pop()}&key=AIzaSyA7lR5SxEB0k_Emr6cLKlPoyKZksvovfAA&part=snippet`)
					.then(response => response.json())
					.then(response => {
						const videoData = response.items[0].snippet;

						dispatch({
							type: 'CHANGE_YOUTUBE_PLAYLIST_ITEM',
							payload: {
								playlistItemIndex,
								newVideoData: {
									name: videoData.title,
									icon: videoData.thumbnails.medium.url,
									url: videoUrl
								}
							}
						});
					});
			}
		},

		onChangeImagePlaylistItem(playlistItemIndex, imageUrl) {
			const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|gif|svg|webp))/i;

			if (imageUrlRegex.test(imageUrl)) {
				dispatch({
					type: 'CHNAGE_IMAGE_PLAYLIST_ITEM',
					payload: {
						playlistItemIndex,
						newImageData: {
							name: imageUrl.split('/').pop().split('?')[0],
							icon: imageUrl,
							url: imageUrl
						}
					}
				});
			}
		},

		onClearPreviewData() {
			dispatch({
				type: 'CLEAR_PREVIEW_DATA'
			});
		},

		onAddPlaylistItem(name, icon, url, type) {
			if (this.appStore.playlist.isEmpty) {
				dispatch({
					type: 'SET_PLAYLIST',
					payload: {
						...this.appStore.playlist,
						isEmpty: false
					}
				});
			}

			dispatch({
				type: 'ADD_PLAYLIST_ITEM',
				payload: {
					name, icon, url, type
				}
			});
		},

		onDeletePlaylistItem(playlistItemId) {
			dispatch({
				type: 'DELETE_PLAYLIST_ITEM',
				payload: playlistItemId
			});
		}
	})
)(Editor);
