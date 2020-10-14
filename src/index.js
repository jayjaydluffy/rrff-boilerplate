import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configureStore, { rrfConfig } from './store/configureStore';
import firebase from './constants/firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

const App = lazy(() => import('./App'));

const initialState = window && window.__INITIAL_STATE__; // set initial state here
const store = configureStore(initialState);

function AuthIsLoaded({ children }) {
	const auth = useSelector((state) => state.firebase.auth);
	if (!auth.isLoaded) return <div className="loading" />;
	return children;
}

ReactDOM.render(
	<Provider store={store}>
		<ReactReduxFirebaseProvider
			firebase={firebase}
			config={rrfConfig}
			dispatch={store.dispatch}
			createFirestoreInstance={createFirestoreInstance}
		>
			<AuthIsLoaded>
				<Suspense fallback={<div className="loading" />}>
					<App />
				</Suspense>
			</AuthIsLoaded>
		</ReactReduxFirebaseProvider>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
