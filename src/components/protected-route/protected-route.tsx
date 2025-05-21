import React, { FC, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchUser } from '../../services/slices/user-slice';

type TRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute: FC<TRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const hasToken = document.cookie
    .split('; ')
    .some((row) => row.startsWith('accessToken='));
  useEffect(() => {
    if (hasToken && !user && !loading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, loading]);

  if (loading || (hasToken && !user)) {
    return null;
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const PublicRoute: FC<TRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const hasToken = document.cookie
      .split('; ')
      .some((row) => row.startsWith('accessToken='));
    if (hasToken && !user && !loading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, loading]);

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};
