const users = []

//addUser,removeUser,getUser,getUsersInRoom

const addUser = ({ id, username, room }) => {
    //clean Data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate the data
    if (!username || !room) {
        return {
            error: 'username and room are required'
        }
    }

    //check for existing user'
    const extistingUser = users.find(user => {
        return user.room === room && user.username === username
    })
    //validate username
    if (extistingUser || username === 'admin') {
        return {
            error: 'username in use'
        }
    }
    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        return users[index]
    }
})

const getUsersInRoom = (roomName) => {
    roomName = roomName.trim().toLowerCase()
    const usersInRoom = users.filter(user => user.room === roomName)
    if (!usersInRoom) {
        return []
    }
    return usersInRoom;
}

addUser({
    id: 22,
    username: ' Basheer',
    room: '   gass  '
})
addUser({
    id: 33,
    username: 'rasheed',
    room: 'gass'
})
console.log(getUsersInRoom('gas'))

module.exports = { addUser, removeUser, getUser, getUsersInRoom }