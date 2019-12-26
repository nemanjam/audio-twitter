import React from 'react';

import withAuthorization from '../../session/withAuthorization';

const AccountPage = () => (
  <div>
    <h1>Account Page</h1>
  </div>
);

export default withAuthorization(session => session && session.me)(
  AccountPage,
);
