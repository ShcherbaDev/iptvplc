import React, { Component } from 'react';
import { connect } from 'react-redux';

import isObjectEmpty from 'assets/js/isObjectEmpty';

import './Editor.scss';

import Search from 'components/Search/Search';
import Modal from 'components/Modal/Modal';
import Card from 'components/Card/Card';
import Loading from 'components/Loading/Loading';

import SimpleChannel from './components/addPlaylistItemModals/SimpleChannel'; 
import YoutubeVideoModal from './components/addPlaylistItemModals/YoutubeVideo/YoutubeVideo';
import ImageModal from './components/addPlaylistItemModals/Image/Image';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

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
				onClose: this.clearModalData.bind(this),
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

	clearModalData() {
		this.setState({
			isModalOpen: false,
			modalContent: '',
			modalData: {
				title: undefined,
				footer: undefined,
				onClose: this.clearModalData.bind(this),
				style: {}
			}
		});
	}

	togglePlaylistItemActive(playlistItemId, isCtrlKeyPressed) {
		if (!isCtrlKeyPressed) {
			const newPlaylistData = this.state.playlist.data.map(item => {
				if (item.id === playlistItemId) {
					return {
						...item,
						active: !item.active
					};
				}
				return {
					...item,
					active: false
				}
			});

			this.setState({
				playlist: {
					...this.state.playlist,
					data: newPlaylistData,
					filteredPlaylistData: newPlaylistData
				}
			});
		}
	}

	addPlaylistItem(name, icon, url, type) {
		const newData = this.state.playlist.data.concat({
			name, icon, url, type,
			duration: -1,
			id: this.state.playlist.data.length
		});

		this.setState({
			playlist: {
				...this.state.playlist,
				data: newData,
				filteredPlaylistData: newData
			}
		});
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
										this.addPlaylistItem(
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
							this.clearModalData();
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
											this.addPlaylistItem(
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
							this.clearModalData();
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
										this.addPlaylistItem(
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
							this.clearModalData();
							this.props.onClearPreviewData();
						}
					}
				});
				break;
		}
	}

	savePlaylist() {
		const { id, data } = this.state.playlist;

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
				new_data: data
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
								onClose: this.clearModalData.bind(this),
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
							<a className="btn btn-block btn-outline-success" href={response} download={this.state.playlist.filename}>Скачать</a>
						),
						onClose: this.clearModalData.bind(this),
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
				onClose: this.clearModalData.bind(this),
				style: {
					width: '44vw'
				}
			}
		});
	}

	deletePlaylistItemConfirmModal() {
		const activePlaylistItems = this.state.playlist.data.findIndex(it => it.active);

		this.clearModalData();
		this.setState({
			isModalOpen: true,
			modalContent: (
				<p className="mb-0">
					Вы уверены, что хотите удалить "{this.state.playlist.data[activePlaylistItems].name}"?
				</p>
			),
			modalData: {
				title: 'Внимание!',
				footer: (
					<button className="btn btn-block btn-outline-success" onClick={() => {
						let newPlaylistData = this.state.playlist.data.slice();
						newPlaylistData.splice(this.state.playlist.data.findIndex(item => item.id === newPlaylistData[activePlaylistItems].id), 1);

						this.setState({
							playlist: {
								...this.state.playlist,
								data: newPlaylistData,
								filteredPlaylistData: newPlaylistData
							}
						});

						this.clearModalData();
					}}>Да</button>
				),
				onClose: this.clearModalData.bind(this),
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

	changePlaylistItem(changedItemIndex, field, newValue) {
		const newPlaylistData = this.state.playlist.data.map((item, index) => {
			if (index === changedItemIndex) {
				return {
					...item,
					[field]: newValue
				}
			}
			return item;
		});

		this.setState({
			playlist: {
				...this.state.playlist,
				data: newPlaylistData,
				filteredPlaylistData: newPlaylistData
			}
		});
	}

	changeYoutubePlaylistItem(changedItemIndex, videoUrl) {
		const regex = /youtube\.com.*(\?v=|\/embed\/)(.{11})/;
		if (regex.test(videoUrl)) {
			fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoUrl.match(regex).pop()}&key=AIzaSyA7lR5SxEB0k_Emr6cLKlPoyKZksvovfAA&part=snippet`)
				.then(response => response.json())
				.then(response => {
					const videoData = response.items[0].snippet;

					const newPlaylistData = this.state.playlist.data.map((item, index) => {
						if (index === changedItemIndex) {
							return {
								...item,
								name: videoData.title,
								icon: videoData.thumbnails.medium.url,
								url: videoUrl
							}
						}
						return item;
					});

					this.setState({
						playlist: {
							...this.state.playlist,
							data: newPlaylistData,
							filteredPlaylistData: newPlaylistData
						}
					});
				});
		}
	}

	changeImagePlaylistItem(changedItemIndex, imageUrl) {
		const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|gif|svg|webp))/i;

		if (imageUrlRegex.test(imageUrl)) {
			const newPlaylistData = this.state.playlist.data.map((item, index) => {
				if (index === changedItemIndex) {
					return {
						...item,
						name: imageUrl.split('/').pop().split('?')[0],
						icon: imageUrl,
						url: imageUrl
					}
				}
				return item;
			});

			this.setState({
				playlist: {
					...this.state.playlist,
					data: newPlaylistData,
					filteredPlaylistData: newPlaylistData
				}
			});
		}
	}

	render() {
		const { playlist } = this.state;
		const { filteredPlaylistData } = playlist;

		const SortableItem = SortableElement(({value, isActive}) => (
			<div
				className={`list-group-item list-group-item-action${isActive ? ' active' : ''}`}
				style={{
					padding: "0 5px 0 0",
					overflow: "hidden",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis"
				}}
				onClick={e => this.togglePlaylistItemActive(value.id, e.ctrlKey)}>
				<img src={value.icon || '/static/images/nopic.jpg'}
					alt={`Иконка ${value.name}`}
					onError={(e) => e.target.src = '/static/images/nopic.jpg'}
					style={{
						width: 64,
						height: 64,
						objectFit: "cover",
						marginRight: 8
					}}/>
				{value.name}
			</div>
			
		));

		const SortableList = SortableContainer(({children}) => {
			return (
				<div className="list-group list-group-flush" style={{ padding: 8 }}>
					{children}
				</div>
			)
		});

		const activePlaylistItems = this.state.playlist.data.findIndex(it => it.active);

		const simpleChannelSettings = activePlaylistItems !== -1 && (
			<>
				<div className="form-group">
					<label htmlFor="channelName">Название канала:</label>
					<input type="text" className="form-control" id="channelName" 
						value={this.state.playlist.data[activePlaylistItems].name}
						onChange={e => this.changePlaylistItem(activePlaylistItems, 'name', e.target.value)} />
				</div>
				<div className="form-group">
					<label htmlFor="channelIcon">URL иконки:</label>
					<input type="url" className="form-control" id="channelIcon" 
						value={this.state.playlist.data[activePlaylistItems].icon}
						onChange={e => {
							this.changePlaylistItem(activePlaylistItems, 'icon', e.target.value);
						}} />
				</div>
				<div className="form-group">
					<label htmlFor="channelUrl">URL:</label>
					<input type="url" className="form-control" id="channelUrl"
						value={this.state.playlist.data[activePlaylistItems].url}
						onChange={e => {
							this.changePlaylistItem(activePlaylistItems, 'url', e.target.value);
						}} />
				</div>
			</>
		);

		const youtubeVideoSettings = activePlaylistItems !== -1 && (
			<div className="form-group">
				<label htmlFor="youtubeVideoUrl">URL видео:</label>
				<input type="url" id="youtubeVideoUrl" className="form-control"
					placeholder="https://youtube.com/..."
					value={this.state.playlist.data[activePlaylistItems].url}
					onChange={e => this.changeYoutubePlaylistItem(activePlaylistItems, e.target.value)} />
			</div>
		);

		const imageSettings = activePlaylistItems !== -1 && (
			<div className="form-group">
				<label htmlFor="imageUrl">URL картинки:</label>
				<input type="url" id="imageUrl" className="form-control"
					value={this.state.playlist.data[activePlaylistItems].url}
					onChange={e => this.changeImagePlaylistItem(activePlaylistItems, e.target.value)} />
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
										<SortableList helperClass="grabbing-playlist-item" lockAxis="y" pressDelay={200} onSortEnd={({oldIndex, newIndex}) => {
											this.setState({
												playlist: {
													...this.state.playlist,
													data: arrayMove(this.state.playlist.data, oldIndex, newIndex),
													filteredPlaylistData: arrayMove(this.state.playlist.data, oldIndex, newIndex)
												}
											});
										}}>
											{filteredPlaylistData.length > 0 ? filteredPlaylistData.map((item, index) => {
												const playlistItem = playlist.data.findIndex(it => it.id === item.id) !== -1 && playlist.data[playlist.data.findIndex(it => it.id === item.id)].active;
												return (
													<SortableItem
														key={`item-${item.id}`}
														index={index}
														value={item}
														isActive={playlistItem} />
												)
											}) : (
												<p style={{
													marginBottom: 0,
													textAlign: "center"
												}}>Ничего не найдено!</p>
											)}
										</SortableList>
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
											switch (this.state.playlist.data[activePlaylistItems].type) {
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
		onClearPreviewData() {
			dispatch({
				type: 'CLEAR_PREVIEW_DATA'
			});
		}
	})
)(Editor);
