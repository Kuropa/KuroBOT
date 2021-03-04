const { prefix } = require('./config.json');

module.exports = (bot, aliases, callback) => {
    if (typeof aliases === 'string') {
        aliases = [aliases]
    }

    bot.on('message', message => {
        const { content } = message;

        aliases.forEach(alias => {
            let command = `${prefix}${alias}`

            if (content.startsWith(`${command} `) || content === command) {
                callback(message)
            }
        })
    })
}