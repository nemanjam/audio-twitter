import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { GET_ALL_MESSAGES_WITH_USERS } from '../../graphql/queries';
import { DELETE_MESSAGE } from '../../graphql/mutations';

const MessageDelete = ({ message }) => {
  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    update(cache) {
      const data = cache.readQuery({
        query: GET_ALL_MESSAGES_WITH_USERS,
      });

      cache.writeQuery({
        query: GET_ALL_MESSAGES_WITH_USERS,
        data: {
          ...data,
          messages: {
            ...data.messages,
            edges: data.messages.edges.filter(
              node => node.id !== message.id,
            ),
            pageInfo: data.messages.pageInfo,
          },
        },
      });
    },
  });

  const onClick = async () => {
    await deleteMessage({
      variables: { id: message.id },
    });
  };

  return (
    <button type="button" onClick={onClick}>
      Delete
    </button>
  );
};

export default MessageDelete;
