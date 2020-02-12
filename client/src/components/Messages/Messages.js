import React, { useEffect, useCallback, Fragment } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import MessagePlayer from '../MessagePlayer/MessagePlayer';
import MessageDelete from '../MessageDelete/MessageDelete';
import Loading from '../Loading/Loading';
import withSession from '../../session/withSession';

import {
  GET_PAGINATED_MESSAGES_WITH_USERS,
  GET_AUTOPLAY,
  GET_MESSAGES_VARIABLES,
} from '../../graphql/queries';
import { SET_MESSAGES_VARIABLES } from '../../graphql/mutations';
import { MESSAGE_CREATED } from '../../graphql/subscriptions';

const useStylesMessages = makeStyles(theme => ({
  noMessages: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
  },
}));

const Messages = ({ limit, username, session }) => {
  const {
    data,
    loading,
    error,
    refetch,
    fetchMore,
    subscribeToMore,
  } = useQuery(GET_PAGINATED_MESSAGES_WITH_USERS, {
    variables: { limit, username },
  });
  const classes = useStylesMessages();
  const [setMessagesVariables] = useMutation(SET_MESSAGES_VARIABLES);

  useEffect(() => {
    refetch();
    setMessagesVariables({
      variables: { username: username || null, limit, cursor: null },
    });
  }, [username, limit]);

  if (loading) {
    return <Loading />;
  }
  // logujes error ako ne radi
  // console.log(data, error, username);

  if (!data) {
    return (
      <div className={classes.noMessages}>
        There are no messages yet ...
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
        session={session}
        username={username}
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
}) => {
  const {
    data: { messagesVariables },
  } = useQuery(GET_MESSAGES_VARIABLES);

  const [setMessagesVariables] = useMutation(SET_MESSAGES_VARIABLES);

  const moreMessagesHandler = () => {
    setMessagesVariables({
      variables: {
        username,
        limit: limit + messagesVariables.limit,
        cursor: null,
      },
    });

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
    });
  };

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={moreMessagesHandler}
    >
      {children}
    </Button>
  );
};

const useStyles = makeStyles(theme => ({
  root: {},
  item: { flex: 1 },
}));

const MessageList = ({
  messages,
  subscribeToMore,
  session,
  username,
}) => {
  const classes = useStyles();
  const subscribeToMoreMessage = useCallback(() => {
    subscribeToMore({
      document: MESSAGE_CREATED,
      variables: { username },
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { messageCreated } = subscriptionData.data;

        const result = {
          ...previousResult,
          messages: {
            ...previousResult.messages,
            edges: [
              messageCreated.message,
              ...previousResult.messages.edges,
            ],
          },
        };
        return result;
      },
    });
  }, [subscribeToMore, username]);

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
          <Grid item className={classes.item} key={i}>
            <MessagePlayer
              duration={duration}
              direction={direction}
              play={shouldPlay(message)}
              session={session}
              message={message}
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
