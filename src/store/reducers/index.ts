import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { platReducer } from './platReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  plats: platReducer,
  // Add more reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
