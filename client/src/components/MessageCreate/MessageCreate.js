import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import ErrorMessage from '../Error/Error';
import { CREATE_MESSAGE } from '../../graphql/mutations';

const MessageCreate = () => {
  const [text, setText] = useState('');

  const [createMessage, { error }] = useMutation(CREATE_MESSAGE);

  const onChange = event => {
    const { value } = event.target;
    setText(value);
  };

  const onSubmit = async event => {
    event.preventDefault();

    try {
      await createMessage({ variables: { text } });
      setText('');
    } catch (error) {}
  };

  return (
    <form onSubmit={event => onSubmit(event)}>
      <textarea
        name="text"
        value={text}
        onChange={onChange}
        type="text"
        placeholder="Your message ..."
      />
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
