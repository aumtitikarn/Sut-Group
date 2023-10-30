// context/store.js
import { createStore } from 'redux';
import rootReducer from './reducers'; // Import the combined reducers from your reducers file.

const store = createStore(rootReducer);

export default store;
