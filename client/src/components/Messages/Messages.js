import React, { useEffect, useCallback, Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';

import MessageDelete from '../MessageDelete/MessageDelete';
import Loading from '../Loading/Loading';
import withSession from '../../session/withSession';

import { GET_PAGINATED_MESSAGES_WITH_USERS } from '../../graphql/queries';
import { MESSAGE_CREATED } from '../../graphql/subscriptions';

const Messages = ({ limit }) => {
  const { data, loading, fetchMore, subscribeToMore } = useQuery(
    GET_PAGINATED_MESSAGES_WITH_USERS,
    {
      variables: { limit },
    },
  );

  if (!data) {
    return (
      <div>
        There are no messages yet ... Try to create one by yourself.
      </div>
    );
  }

  const { messages } = data;

  if (loading || !messages) {
    return <Loading />;
  }

  const { edges, pageInfo } = messages;

  return (
    <Fragment>
      <MessageList
        messages={edges}
        subscribeToMore={subscribeToMore}
      />

      {pageInfo.hasNextPage && (
        <MoreMessagesButton
          limit={limit}
          pageInfo={pageInfo}
          fetchMore={fetchMore}
        >
          More
        </MoreMessagesButton>
      )}
    </Fragment>
  );
};

const MoreMessagesButton = ({
  limit,
  pageInfo,
  fetchMore,
  children,
}) => (
  <button
    type="button"
    onClick={() =>
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
          limit,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          return {
            messages: {
              ...fetchMoreResult.messages,
              edges: [
                ...previousResult.messages.edges,
                ...fetchMoreResult.messages.edges,
              ],
            },
          };
        },
      })
    }
  >
    {children}
  </button>
);

const MessageList = ({ messages, subscribeToMore }) => {
  const subscribeToMoreMessage = useCallback(() => {
    subscribeToMore({
      document: MESSAGE_CREATED,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { messageCreated } = subscriptionData.data;

        return {
          ...previousResult,
          messages: {
            ...previousResult.messages,
            edges: [
              messageCreated.message,
              ...previousResult.messages.edges,
            ],
          },
        };
      },
    });
  }, [subscribeToMore]);

  useEffect(() => {
    subscribeToMoreMessage();
  }, [subscribeToMoreMessage]);

  return messages.map(message => (
    <MessageItem key={message.id} message={message} />
  ));
};

const MessageItemBase = ({ message, session }) => (
  <div>
    <h3>{message.user.username}</h3>
    <small>{message.createdAt}</small>
    <p>{message.text}</p>

    {session && session.me && message.user.id === session.me.id && (
      <MessageDelete message={message} />
    )}
  </div>
);

const MessageItem = withSession(MessageItemBase);

export default Messages;
