import { removeItem } from '../helpers/arrays';

const initialState = {
	currentSubpage: 'hub',
	playlist: {},

	previewData: {
		name: '',
		icon: '',
		url: '',
		channel: ''
	}
};

export default function appReducer(state = initialState, action) {
	switch (action.type) {
		case 'SET_APP_SUBPAGE':
			return {
				...state,
				currentSubpage: action.payload
			};

		case 'SET_PLAYLIST':
			action.payload.data.forEach((playlistItem) => {
				const item = playlistItem;

				// For youtube video
				if (
					/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/.test(item.url)
					&& /^https?\:\/\/(.*\.*ytimg\.com.*\/)(\.?.*).*/.test(item.icon)
				) {
					item.type = 'youtube';
				}

				// For image
				else if (
					/(https?:\/\/.*\.(?:png|jpg|gif|svg|webp))/i.test(item.url)
					&& item.url === item.icon
				) {
					item.type = 'image';
				}

				// For everything else
				else {
					item.type = 'simpleChannel';
				}
			});

			return {
				...state,
				playlist: action.payload
			};

		case 'TOGGLE_PLAYLIST_ITEM_ACTIVE':
			return {
				...state,
				playlist: {
					...state.playlist,
					data: state.playlist.data.map((item) => {
						if (item.id === action.payload) {
							return {
								...item,
								active: !item.active
							};
						}
						return {
							...item,
							active: false
						};
					})
				}
			};

		case 'SET_PREVIEW_DATA':
			return {
				...state,
				previewData: {
					...state.previewData,
					...action.payload
				}
			};

		case 'CHANGE_PLAYLIST_ITEM': {
			const { playlistItemIndex, key, newValue } = action.payload;

			return {
				...state,
				playlist: {
					...state.playlist,
					data: state.playlist.data.map((item, index) => {
						if (index === playlistItemIndex) {
							return {
								...item,
								[key]: newValue
							};
						}
						return item;
					})
				}
			};
		}

		case 'CHANGE_YOUTUBE_PLAYLIST_ITEM': {
			const { playlistItemIndex, newVideoData } = action.payload;

			return {
				...state,
				playlist: {
					...state.playlist,
					data: state.playlist.data.map((item, index) => {
						if (index === playlistItemIndex) {
							return {
								...item,
								...newVideoData
							};
						}
						return item;
					})
				}
			};
		}

		case 'CHNAGE_IMAGE_PLAYLIST_ITEM': {
			const { playlistItemIndex, newImageData } = action.payload;

			return {
				...state,
				playlist: {
					...state.playlist,
					data: state.playlist.data.map((item, index) => {
						if (index === playlistItemIndex) {
							return {
								...item,
								...newImageData
							};
						}
						return item;
					})
				}
			};
		}

		case 'CLEAR_PREVIEW_DATA':
			return {
				...state,
				previewData: {
					name: '',
					icon: '',
					url: '',
					channel: ''
				}
			};

		case 'ADD_PLAYLIST_ITEM':
			return {
				...state,
				playlist: {
					...state.playlist,
					data: [
						...state.playlist.data,
						{
							...action.payload,
							id: state.playlist.data.length
						}
					]
				}
			};

		case 'DELETE_PLAYLIST_ITEM': {
			const resultPlaylist = removeItem(state.playlist.data, state.playlist.data.findIndex(item => item.id === action.payload));

			return {
				...state,
				playlist: {
					...state.playlist,
					isEmpty: resultPlaylist.length < 1,
					data: resultPlaylist
				}
			};
		}

		default: return state;
	}
}
