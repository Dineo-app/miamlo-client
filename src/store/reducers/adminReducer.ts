import {
  FETCH_ADMIN_STATS_REQUEST,
  FETCH_ADMIN_STATS_SUCCESS,
  FETCH_ADMIN_STATS_FAILURE,
  FETCH_CHEFS_REQUEST,
  FETCH_CHEFS_SUCCESS,
  FETCH_CHEFS_FAILURE,
  FETCH_CHEF_DETAIL_REQUEST,
  FETCH_CHEF_DETAIL_SUCCESS,
  FETCH_CHEF_DETAIL_FAILURE,
  CREATE_PLATE_FOR_CHEF_REQUEST,
  CREATE_PLATE_FOR_CHEF_SUCCESS,
  CREATE_PLATE_FOR_CHEF_FAILURE,
} from '../types/actionTypes';
import type { AdminStats, ChefListItem, ChefDetail } from '../actions/adminActions';

interface AdminState {
  stats: AdminStats | null;
  chefs: ChefListItem[];
  selectedChef: ChefDetail | null;
  loading: boolean;
  chefsLoading: boolean;
  chefDetailLoading: boolean;
  createPlateLoading: boolean;
  error: string | null;
  chefsError: string | null;
  chefDetailError: string | null;
  createPlateError: string | null;
}

const initialState: AdminState = {
  stats: null,
  chefs: [],
  selectedChef: null,
  loading: false,
  chefsLoading: false,
  chefDetailLoading: false,
  createPlateLoading: false,
  error: null,
  chefsError: null,
  chefDetailError: null,
  createPlateError: null,
};

const adminReducer = (state = initialState, action: any): AdminState => {
  switch (action.type) {
    // Stats actions
    case FETCH_ADMIN_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload,
        error: null,
      };
    case FETCH_ADMIN_STATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Chefs list actions
    case FETCH_CHEFS_REQUEST:
      return {
        ...state,
        chefsLoading: true,
        chefsError: null,
      };
    case FETCH_CHEFS_SUCCESS:
      return {
        ...state,
        chefs: action.payload,
        chefsLoading: false,
        chefsError: null,
      };
    case FETCH_CHEFS_FAILURE:
      return {
        ...state,
        chefsLoading: false,
        chefsError: action.payload,
      };

    // Chef detail actions
    case FETCH_CHEF_DETAIL_REQUEST:
      return {
        ...state,
        chefDetailLoading: true,
        chefDetailError: null,
      };
    case FETCH_CHEF_DETAIL_SUCCESS:
      return {
        ...state,
        selectedChef: action.payload,
        chefDetailLoading: false,
        chefDetailError: null,
      };
    case FETCH_CHEF_DETAIL_FAILURE:
      return {
        ...state,
        chefDetailLoading: false,
        chefDetailError: action.payload,
      };

    // Create plate actions
    case CREATE_PLATE_FOR_CHEF_REQUEST:
      return {
        ...state,
        createPlateLoading: true,
        createPlateError: null,
      };
    case CREATE_PLATE_FOR_CHEF_SUCCESS:
      return {
        ...state,
        createPlateLoading: false,
        createPlateError: null,
        // Add the new plate to selected chef's plates if chef is loaded
        selectedChef: state.selectedChef
          ? {
              ...state.selectedChef,
              plates: [...state.selectedChef.plates, action.payload],
            }
          : null,
      };
    case CREATE_PLATE_FOR_CHEF_FAILURE:
      return {
        ...state,
        createPlateLoading: false,
        createPlateError: action.payload,
      };

    default:
      return state;
  }
};

export { adminReducer };
