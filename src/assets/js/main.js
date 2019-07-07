// Adding libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Store
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

// Redux reducers
import playlistCreatorReducer from '../../store/reducers/playlistCreatorReducer';

// Adding components
import Site from '../../views/Site';

// Adding styles
import '../styles/bootstrap.min.css';
import '../styles/styles.scss';

const rootReducer = combineReducers({
	playlistCreatorReducer
});

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
	<Provider store={store}>
		<Site />
	</Provider>,
	document.getElementById('root')
);
