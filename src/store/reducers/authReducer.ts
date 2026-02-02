import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../types/actionTypes';

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
      
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        error: null,
      };
      
    default:
      return state;
  }
};
