import {
  legacy_createStore as createStore,
  combineReducers,
  compose,
} from "redux";
import { songReducer } from "./reducers/song.reducer";
import { playlistReducer } from "./reducers/playlist.reducer";
import { systemReducer } from "./reducers/system.reducer";
import { songQueueReducer } from "./reducers/songQueue.reducer";
import { userLibraryReducer } from "./reducers/userLibrary.reducer";

const rootReducer = combineReducers({
  songModule: songReducer,
  playlistModule: playlistReducer,
  systemModule: systemReducer,
  songQueueModule: songQueueReducer,
  userLibraryModule: userLibraryReducer,
});

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true, // Enable the trace feature
      traceLimit: 25, // Optional: Limit the stack trace to 25 steps to save memory
    })) ||
  compose;
export const store = createStore(rootReducer, composeEnhancers());

// For debug:
// store.subscribe(() => {
//     console.log('**** Store state changed: ****')
//     console.log('storeState:\n', store.getState())
//     console.log('*******************************')
// })
