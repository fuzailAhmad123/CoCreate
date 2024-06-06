let users = [];

//add users
const addUser = ({name, userId, roomId, host, presenter, socketId}) => {
 const user = {name, userId, roomId, host, presenter, socketId};
 users.push(user);
 return users.filter(user => user.roomId === roomId);
};


// Remove user from the list 
const removeUser = (id) => {
 const index = users.findIndex(user => user.socketId === id);
 if(index !== -1){
     users.splice(index, 1)[0];
     return users;
 }
}

//get user from the list
const getUser = (id) => {
    return users.find(user => user.socketId === id);
}

//get all users from the list
const usersInRoom = (id) => {
    return users.filter(user => user.roomId === id);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    usersInRoom
}