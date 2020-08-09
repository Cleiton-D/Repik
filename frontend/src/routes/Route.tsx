import React from 'react';
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';

import Header from '../components/Header';
import { useAuth } from '../hooks/auth';

import { Wrapper } from './styles';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  path,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      path={path}
      {...rest}
      render={({ location }) => {
        if (path === '/' && user) {
          return (
            <Redirect
              to={{ pathname: '/dashboard', state: { from: location } }}
            />
          );
        }

        if (!isPrivate) return <Component />;
        return isPrivate && !!user ? (
          <PrivateWrapper>
            <Component />
          </PrivateWrapper>
        ) : (
          <Redirect to={{ pathname: '/', state: { from: location } }} />
        );
      }}
    />
  );
};

const PrivateWrapper: React.FC = ({ children }) => (
  <>
    <Header />
    <Wrapper>{children}</Wrapper>
  </>
);

export default Route;
