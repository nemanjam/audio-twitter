import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import ErrorMessage from '../Error/Error';
import { CREATE_MESSAGE } from '../../graphql/mutations';

const MessageCreate = () => {
  const [file, setFile] = useState(null);

  const [createMessage, { error }] = useMutation(CREATE_MESSAGE);

  const onChange = event => {
    const { name, value, files } = event.target;
    if (name === 'file') setFile(files[0]);
  };

  const onSubmit = async event => {
    event.preventDefault();

    try {
      await createMessage({ variables: { file } });
      setFile(null);
    } catch (error) {}
  };

  return (
    <form onSubmit={event => onSubmit(event)}>
      <input type="file" name="file" onChange={onChange} />
      <button type="submit">Send</button>

      {error && <ErrorMessage error={error} />}
    </form>
  );
};

export default MessageCreate;

// Not used anymore because of Subscription

// update={(cache, { data: { createMessage } }) => {
//   const data = cache.readQuery({
//     query: GET_ALL_MESSAGES_WITH_USERS,
//   });

//   cache.writeQuery({
//     query: GET_ALL_MESSAGES_WITH_USERS,
//     data: {
//       ...data,
//       messages: {
//         ...data.messages,
//         edges: [createMessage, ...data.messages.edges],
//         pageInfo: data.messages.pageInfo,
//       },
//     },
//   });
// }}
