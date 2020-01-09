const generateMessage = (username, text) => {
    return {
        text,
        username,
        createdAt: new Date().getTime()
    }
}
const generateLocationMessages = (username, url) => {
    return {
        url,
        username,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocationMessages
}