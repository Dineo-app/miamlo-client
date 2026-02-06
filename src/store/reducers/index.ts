import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { platReducer } from './platReducer';
import { adminReducer } from './adminReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  plats: platReducer,
  admin: adminReducer,
  // Add more reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
