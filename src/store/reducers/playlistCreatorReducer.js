import { insertItem, removeItem } from '../helpers/arrays';

/**
 * initialState.selectedPlaylistItems supports only one item in array yet.
 * TODO: add support of few items in initialState.selectedPlaylistItems
 */
const initialState = {
	defaultPlaylist: {},
	userPlaylist: [],
	selectedPlaylistItems: null
};

export default function playlistCreatorReducer(state = initialState, action) {
	switch (action.type) {
		case 'SET_DEFAULT_PLAYLIST': {
			const newDefaultPlaylist = action.payload;

			return {
				...state,
				defaultPlaylist: newDefaultPlaylist
			};
		}

		case 'ADD_ITEM_TO_DEFAULT_PLAYLIST': {
			const { defaultPlaylist, userPlaylist } = state;
			const newItemInPlaylist = action.payload;
			const itemIndexInUserPlaylist = userPlaylist.findIndex(item => item.id === newItemInPlaylist.id);

			let newDefaultPlaylist = {};
			let newUserPlaylist = [];

			// If user is dragging playlist item from user playlist to default playlist
			if (itemIndexInUserPlaylist !== -1) {
				newUserPlaylist = removeItem(userPlaylist, itemIndexInUserPlaylist);
			}

			newDefaultPlaylist = {
				...defaultPlaylist,
				[action.payload.inf.group]: insertItem(defaultPlaylist[newItemInPlaylist.inf.group], newItemInPlaylist)
			};

			return {
				...state,
				defaultPlaylist: newDefaultPlaylist,
				userPlaylist: newUserPlaylist
			};
		}

		case 'ADD_ITEM_TO_USER_PLAYLIST': {
			const { defaultPlaylist, userPlaylist } = state;

			// Deleting playlist item from default playlist
			const newDefaultPlaylist = {
				...defaultPlaylist,
				[action.payload.inf.group]: removeItem(defaultPlaylist[action.payload.inf.group], defaultPlaylist[action.payload.inf.group].findIndex(item => item.id === action.payload.id))
			};

			// Adding playlist item to user playlist
			const newUserPlaylist = userPlaylist.concat(action.payload);

			return {
				...state,
				defaultPlaylist: newDefaultPlaylist,
				userPlaylist: newUserPlaylist
			};
		}

		case 'SELECT_ITEM': {
			let newSelectedItem = state.selectedPlaylistItems;

			if (typeof action.payload === 'number') {
				// If clicked playlist item wasn't selected
				if (newSelectedItem !== action.payload) {
					newSelectedItem = action.payload;

					return {
						...state,
						selectedPlaylistItems: newSelectedItem
					};
				}

				return {
					...state,
					selectedPlaylistItems: null
				};
			}
			throw new Error(`${action.payload} is not a number!`);
		}

		case 'CLEAR_PLAYLISTS': {
			return initialState;
		}

		default: {
			return state;
		}
	}
}
