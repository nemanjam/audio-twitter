# Audio Twitter

## Twitter clone made with React, Apollo, MongoDB, Material-UI, Wavesurfer

This is fullstack clone of Twitter with audio instead text messages. It is made for educational purposes only and it is not affiliated with Twitter in any way.

## Features

- General functionalities

  - Record voice, preview oscilloscope, redo recording, preview recording, cancel recording, preview recorded waveform
  - Store audio files to server
  - Play/pause/stop audio messages with waveform preview
  - Autoplay existing messages, autoplay incoming messages
  - Limit autoplay duration to 5, 10, 15 or 20 seconds
  - Timeline feed of messages of the following users
  - Notifications feed
  - Profile page with user's messages feed, following and followers lists
  - Social network functionalities: follow/unfollow users, like/unlike messages, repost/unrepost messages
  - Local state management with Apollo cache, without Redux

- Authentication

  - JWT auth on http and websocket links
  - Sign up with email/password, sign in
  - User/admin role

- Design

  - Material-UI responsive design
  - Choose between 4 different green/orange light/dark themes
  - Tabs navigation
  - Popover with user card

- GraphQL

  - Queries User: users, user, me, whoToFollow
  - Queries Message: messages, message
  - Queries Notification: notifications
  - Mutations User: signUp, signIn, updateUser, deleteUser, followUser, unfollowUser
  - Mutations Message: createMessage, deleteMessage, likeMessage, unlikeMessage, repostMessage, unrepostMessage
  - Subscriptions: messageCreated, notificationCreated
  - Relay cursor paginations: Messages, Notifications
  - Loaders: File, User
  - Client Queries: autoplay, theme
  - Client Mutations: updateAutoplay, setTheme

- Database
  - Mongoose Models: User, Message, File, Notification
  - Seed database with Faker

## Screenshots

![Screenshot1](/screenshots/Screenshot_1.png)

## Libraries used

### Client:

- React `16.12` with functional components and Hooks
- Material-UI `4.8`
- Apollo Client `2.6`, Apollo Upload Client
- React Mic, Wavesurfer.js `3.3`

### Server:

- Apollo Server `2.9`, Apollo Server Express
- Mongoose `5.8`
- Faker, Dotenv, Babel

## Installation and running

- `git clone git@github.com:nemanjam/audio-twitter.git`
- `cd audio-twitter/client`
- `cd audio-twitter/server`
- `npm install`
- rename `.env.example` to `.env` and set database url and JWT secret
- `npm start`
- visit `http://localhost:3000` for client and `http://localhost:8000` for server

## References

- [Twitter](https://twitter.com)
- Robin Wieruch [React Apollo boilerplate](https://github.com/the-road-to-graphql/fullstack-apollo-react-boilerplate)
- Robin Wieruch [Node.js with Express + MongoDB boilerplate](https://github.com/the-road-to-graphql/fullstack-apollo-express-mongodb-boilerplate)
- Apollo [docs](https://www.apollographql.com/docs/)
- Material-UI [docs](https://material-ui.com/getting-started/installation/)

## Licence

### MIT
