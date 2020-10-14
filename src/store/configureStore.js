import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './';
import { getFirebase } from 'react-redux-firebase';
import { getFirestore, reduxFirestore } from 'redux-firestore';
import firebaseConfig from '../constants/firebase';

export const rrfConfig = {
	userProfile: 'users',
	useFirestoreForProfile: true,
	enableLogging: false,
	updateProfileOnLogin: false
};

export default function configureStore(initialState, history) {
	const enhancers = [];

	if (window && window.location && window.location.hostname === 'localhost') {
		const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
		if (typeof devToolsExtension === 'function') {
			enhancers.push(devToolsExtension());
		}
	}

	const middleware = [thunk.withExtraArgument({ getFirebase, getFirestore })];
	const createStoreWithMiddleware = compose(
		applyMiddleware(...middleware),
		reduxFirestore(firebaseConfig),
		...enhancers
	)(createStore);
	const store = createStoreWithMiddleware(rootReducer);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./', () => {
			const nextRootReducer = require('./');
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
}
