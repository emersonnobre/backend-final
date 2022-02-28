function userToResponse(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
    }
}

module.exports = userToResponse