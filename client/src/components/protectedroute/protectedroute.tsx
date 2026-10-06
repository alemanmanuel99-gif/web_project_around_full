import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  loggedIn: boolean;
  isCheckingToken: boolean;
  children: React.ReactNode;
};

export default function ProtectedRoute(props: ProtectedRouteProps): React.JSX.Element | null {
  const { loggedIn, isCheckingToken, children } = props;

  if (isCheckingToken) {
    return null;
  }

  if (!loggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
