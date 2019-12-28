import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import ErrorMessage from '../Error/Error';
import { CREATE_MESSAGE } from '../../graphql/mutations';

const MessageCreate = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const [createMessage, { error }] = useMutation(CREATE_MESSAGE);

  const onChange = event => {
    const { name, value, files } = event.target;
    if (name === 'text') setText(value);
    if (name === 'file') setFile(files[0]);
  };

  const onSubmit = async event => {
    event.preventDefault();
    console.log(file);

    try {
      await createMessage({ variables: { text, file } });
      setText('');
      setFile(null);
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
