import React, { useEffect, useCallback, Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import MessagePlayer from '../MessagePlayer/MessagePlayer';
import MessageDelete from '../MessageDelete/MessageDelete';
import Loading from '../Loading/Loading';
import withSession from '../../session/withSession';
import {
  UPLOADS_AUDIO_FOLDER,
  UPLOADS_IMAGES_FOLDER,
} from '../../constants/paths';

import {
  GET_PAGINATED_MESSAGES_WITH_USERS,
  GET_AUTOPLAY,
} from '../../graphql/queries';
import { MESSAGE_CREATED } from '../../graphql/subscriptions';

const Messages = ({ limit, username }) => {
  const {
    data,
    loading,
    error,
    fetchMore,
    subscribeToMore,
  } = useQuery(GET_PAGINATED_MESSAGES_WITH_USERS, {
    variables: { limit, username },
  });

  if (loading) {
    return <Loading />;
  }
  // logujes error ako ne radi
  // console.log(data, error, username);

  if (!data) {
    return (
      <div>
        There are no messages yet ... Try to create one by yourself.
      </div>
    );
  }

  const { messages } = data;

  //console.log(messages);
  const { edges, pageInfo } = messages;

  return (
    <Fragment>
      <MessageList
        messages={edges}
        subscribeToMore={subscribeToMore}
      />

      {pageInfo.hasNextPage && (
        <Grid container justify="center" style={{ paddingTop: 16 }}>
          <Grid item>
            <MoreMessagesButton
              limit={limit}
              pageInfo={pageInfo}
              fetchMore={fetchMore}
              username={username}
            >
              More
            </MoreMessagesButton>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
};

const MoreMessagesButton = ({
  limit,
  pageInfo,
  fetchMore,
  children,
  username,
}) => (
  <Button
    color="primary"
    variant="contained"
    onClick={() =>
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
          limit,
          username,
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
  </Button>
);

const useStyles = makeStyles(theme => ({
  root: {},
  item: { flex: 1 },
}));

const MessageList = ({ messages, subscribeToMore }) => {
  const classes = useStyles();
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

  const {
    data: {
      autoplay: { direction, createdAt, duration },
    },
  } = useQuery(GET_AUTOPLAY);

  const shouldPlay = message => {
    if (direction === 'existing') {
      const firstMessage = messages.find(m =>
        moment(m.createdAt).isBefore(createdAt),
      );
      const result = firstMessage && message.id === firstMessage.id;
      return result;
    }
    if (direction === 'incoming') {
      const firstMessage = messages.find(m =>
        moment(m.createdAt).isAfter(createdAt),
      );
      const result = firstMessage && message.id === firstMessage.id;
      return result;
    }
  };

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      className={classes.root}
    >
      {messages.map((message, i) => {
        return (
          <Grid item className={classes.item} key={message.id}>
            <MessagePlayer
              duration={duration}
              direction={direction}
              createdAt={message.createdAt}
              play={shouldPlay(message)}
              path={`${UPLOADS_AUDIO_FOLDER}${message.file.path}`}
              avatar={`${UPLOADS_IMAGES_FOLDER}${message.user.avatar.path}`}
              username={message.user.username}
              name={message.user.name}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const MessageItemBase = ({ message, session }) => (
  <div>
    <h3>{message.user.username}</h3>
    <small>{message.createdAt}</small>
    <p>{message.file.path}</p>

    {session && session.me && message.user.id === session.me.id && (
      <MessageDelete message={message} />
    )}
  </div>
);

const MessageItem = withSession(MessageItemBase);

export default Messages;
