'use client';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { login, logout } from '@/store/slices/authSlice';
import { fetchDeals } from '@/store/slices/dealsSlice';

const ApiTestPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, token, loading: authLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const { deals, loading: dealsLoading, error: dealsError } = useSelector((state: RootState) => state.deals);

  const handleLogin = () => {
    // Replace with actual credentials
    dispatch(login({ email: 'test@example.com', password: 'password' }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleFetchDeals = () => {
    if (token) {
      dispatch(fetchDeals());
    } else {
      alert('You must be logged in to fetch deals.');
    }
  };

  return (
    <div>
      <h1>API Test Page</h1>
      <div>
        <h2>Auth</h2>
        {authLoading && <p>Loading...</p>}
        {authError && <p>Error: {authError}</p>}
        {user ? (
          <div>
            <p>Welcome, {user.name}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
      <hr />
      <div>
        <h2>Deals</h2>
        <button onClick={handleFetchDeals} disabled={!token}>Fetch Deals</button>
        {dealsLoading && <p>Loading deals...</p>}
        {dealsError && <p>Error: {dealsError}</p>}
        {deals.length > 0 && (
          <ul>
            {deals.map((deal: any) => (
              <li key={deal._id}>{deal.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;
