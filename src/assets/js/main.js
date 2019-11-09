// Adding libraries
import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.bundle.min';

// Store
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

// Redux reducers
import appReducer from '../../store/reducers/appReducer';

// Adding components
import Site from '../../views/Site';

// Adding styles
import '../styles/bootstrap.min.css';
import '../styles/styles.scss';

const rootReducer = combineReducers({
	appReducer
});

const store = createStore(rootReducer, node_env === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : emptyFunc => emptyFunc);

ReactDOM.render(
	<Provider store={store}>
		<Site />
	</Provider>,
	document.getElementById('root')
);
