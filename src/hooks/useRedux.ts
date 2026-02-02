import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector);
