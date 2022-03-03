module.exports = function Article({ name, description, content, userId, categoryId, imageUrl, }) {
    return {
        name,
        description, 
        content: Buffer.from(content, 'utf-8'), 
        userId,
        categoryId,
        imageUrl,
    }
}