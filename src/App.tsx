import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { router } from '@/routes';
import { restoreAuth } from '@/store/actions/authActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore authentication state from cookies on app load
    (dispatch as any)(restoreAuth());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
