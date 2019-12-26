import React from 'react';

import withSession from '../../session/withSession';

import MessageCreate from '../../components/MessageCreate/MessageCreate';
import Messages from '../../components/Messages/Messages';

const Landing = ({ session }) => (
  <div>
    <h2>Landing Page</h2>

    {session && session.me && <MessageCreate />}
    <Messages limit={2} />
  </div>
);

export default withSession(Landing);
