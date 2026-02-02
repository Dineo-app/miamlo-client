import { FETCH_PLATS_REQUEST, FETCH_PLATS_SUCCESS, FETCH_PLATS_FAILURE } from '../types/actionTypes';
import type { Plat } from '@/types';

interface PlatState {
  plats: Plat[];
  loading: boolean;
  error: string | null;
}

const initialState: PlatState = {
  plats: [],
  loading: false,
  error: null,
};

export const platReducer = (state = initialState, action: any): PlatState => {
  switch (action.type) {
    case FETCH_PLATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case FETCH_PLATS_SUCCESS:
      return {
        ...state,
        loading: false,
        plats: action.payload,
        error: null,
      };
      
    case FETCH_PLATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    default:
      return state;
  }
};
