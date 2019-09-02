const sendFurther = (id, name, obj, connectionsWithPosts) => {
  const connections = connectionsWithPosts.get(id);
  if (connections) {
    connections.forEach(connection => {
      connection.emit(name, obj);
    });
  }
};
module.exports = sendFurther;
