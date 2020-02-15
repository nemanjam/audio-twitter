import React from 'react';

import withAuthorization from '../session/withAuthorization';

const AdminPage = () => (
  <div>
    <h1>Admin Page</h1>
  </div>
);

//session je data iz me queryja, data.me
export default withAuthorization(
  session => session?.me?.role === 'ADMIN',
)(AdminPage);
