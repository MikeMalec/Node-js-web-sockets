const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const sendFurther = require('./sendFurther');

let connectionsWithPosts = new Map();

let users = new Map();

server.listen(4000);

app.use(express.json());

app.post('/newComment', (req, res) => {
  const { id, entity } = req.body;
  sendFurther(id, 'newComment', entity, connectionsWithPosts);

  res.end();
});

app.post('/newCommentOfComment', (req, res) => {
  const { id, additionalId, entity } = req.body;
  entity['additionalId'] = additionalId;
  sendFurther(id, 'newCommentOfComment', entity, connectionsWithPosts);
  res.end();
});

app.post('/newLike', (req, res) => {
  const { id, entity } = req.body;
  sendFurther(id, 'newLike', entity, connectionsWithPosts);
  res.end();
});

app.post('/newDislike', (req, res) => {
  const { id, entity } = req.body;
  sendFurther(id, 'newDislike', entity, connectionsWithPosts);
  res.end();
});

app.post('/newNotification', (req, res) => {
  const { id, entity } = req.body;
  const userConnection = users.get(id);
  if (userConnection) {
    userConnection.emit('newNotification', { notification: entity });
  }
  res.end();
});

io.sockets.on('connection', socket => {
  socket.on('source', data => {
    if (connectionsWithPosts.get(data.id) !== undefined) {
      connectionsWithPosts.get(data.id).push(socket);
    } else {
      let connectionsWithParticularPost = [];
      connectionsWithParticularPost.push(socket);
      connectionsWithPosts.set(data.id, connectionsWithParticularPost);
    }
  });

  socket.on('notification', data => {
    users.set(data.id, socket);
  });
  socket.on('disconnect', data => {
    let usersSockets = connectionsWithPosts.get(data.id);
    if (usersSockets) {
      userSockets = usersSockets.filter(userSocket => !userSocket === socket);
      connectionsWithPosts.set(data.id, usersSockets);
    }
  });
  console.log(connectionsWithPosts);
});
