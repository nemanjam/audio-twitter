import React from 'react';
import { Route } from 'react-router-dom';

const RouteWithLayout = ({
  layout: Layout,
  component: Component,
  layoutProps,
  componentProps,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={matchProps => {
        return (
          <Layout {...layoutProps}>
            <Component {...matchProps} {...componentProps} />
          </Layout>
        );
      }}
    />
  );
};

export default RouteWithLayout;
