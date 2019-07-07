// Adding libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Store
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import initialState from '../../store/initialState';

// Adding components
import Site from '../../views/Site';

// Adding styles
import '../styles/bootstrap.min.css';
import '../styles/styles.scss';

/**
 * Method of adding array item at specific index without mutations.
 * https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns#inserting-and-removing-items-in-arrays
 */
function insertItem(array, action) {
	const newArray = array.slice();
	newArray.splice(action.id, 0, action);
	return newArray;
}

/**
 * Method of deleting array item from specific index without mutations.
 * https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns#inserting-and-removing-items-in-arrays
 */
function removeItem(array, actionId) {
	const newArray = array.slice();
	newArray.splice(actionId, 1);
	return newArray;
}

function appReducer(state = initialState, action) {
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
			}

			return {
				...state,
				defaultPlaylist: newDefaultPlaylist,
				userPlaylist: newUserPlaylist
			};
		}

		case 'ADD_ITEM_TO_USER_PLAYLIST': {
			const { defaultPlaylist, userPlaylist } = state;

			// Deleting playlist item from default playlist
			let newDefaultPlaylist = {};
			newDefaultPlaylist = {
				...defaultPlaylist, 
				[action.payload.inf.group]: removeItem(defaultPlaylist[action.payload.inf.group], defaultPlaylist[action.payload.inf.group].findIndex(item => item.id === action.payload.id))
			};

			// Adding playlist item to user playlist
			let newUserPlaylist = userPlaylist;
			newUserPlaylist = newUserPlaylist.concat(action.payload);

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

const store = createStore(appReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
	<Provider store={store}>
		<Site />
	</Provider>,
	document.getElementById('root')
);
