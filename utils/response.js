function createResponse(statusCode, msg, data = null) {
    return {
        status: statusCode,
        message: msg,
        data,
    }
}

module.exports = createResponse