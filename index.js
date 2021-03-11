const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const command = require('./command.js');
const servers = bot.guilds;
const talkedRecently = new Set();

bot.on('ready', () => {
    bot.user.setPresence({
        status: 'online',
        activity: {
            type: 'PLAYING',
            name: '-kinfo',
        },
    });

    checkRole()
    clearRole()

    command(bot, ['kinfo', 'Kinfo', 'KINFO'], (message) => {
        const help = new Discord.MessageEmbed()
            .setTitle('Список доступных команд:')
            .setDescription('')
            .addFields(
                {
                    name: "\u200B",
                    value: "\u200B"
                },
                {
                    name: "Русская Рулетка",
                    value: "Для ознакомления с полными правилами игры используйте команду **-rrinfo**\n Для запуска игры используйте команду **-rr**"
                },
                {
                    name: "\u200B",
                    value: "\u200B"
                },
                {
                    name: "Парные команды:",
                    value: "-simp @userName\n-obey @userName\n-beat @userName\n -kill\n -fuckyou @userName\n",
                    inline: true
                },
                {
                    name: "Одиночные команды:",
                    value: "-suicide\n -sad\n-horny\n-flex\n",
                    inline: true
                },
                {
                    name: "\u200B",
                    value: "\u200B"
                },
                // {
                //     name: "Ссылка на приглашение бота:",
                //     value: "[KuroBOT](https://discord.com/oauth2/authorize?client_id=812993383328382996&scope=bot&permissions=0)"
                // },
                {
                    name: "Добавление опроса:",
                    value: "Вы можете создать общественный опрос.\n" +
                        "Добавить опрос можно воспользовавшись шаблоном: **-ask Вопрос? Ответ, Ответ, Ответ\n" +
                        "Количество ответов не может превышать 10, в указании ответов недопустимо использование знака вопроса."
                },
                {
                    name: "\u200B",
                    value: "\u200B"
                },
                {
                    name: "Последние изменения:",
                    value: " 09.03 Возвращены команды **-suicide** и **-kill**\n " +
                        "Пополнение коллекции **horny** и **simp**\n" +
                        "11.03 Добавлена команда **-ask**"
                },
                {
                    name: "\u200B",
                    value: "\u200B"
                },
                {
                    name: "По всем вопросам работоспособности и функционала бота:",
                    value: "<@198955830136012801>"
                }
            )
            .setColor('0x0A')
            .setFooter('Kuropa#0205', 'https://images-ext-1.discordapp.net/external/lJ826P5S3lsZen7tUpKNFcZjhzAfkB6-7ZZBGgURqVU/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/198955830136012801/fc33a16c26398751728d8e9f845664d1.webp?width=468&height=468')

        commandClear(message);
        message.reply(help);
    });

    command(bot, ['rrinfo','Rrinfo','RRINFO'], message => {
        const rrinfo = new Discord.MessageEmbed()
            .setTitle('Русская рулетка')
            .setDescription(`Для запуска игры отправьте команду -rr в чат.
            С вероятностью 16% вы получите пулю, которая назначит вам роль "Russian Roulette" на 10 минут.
            С вероятностью 1.6% вы получите пулю, которая назначит вам роль "Russian Roulette" на 1 час.
            Задержка между отправкой команд составляет 5 минут.
            Информация для Администраторов:
            Для получения полного спектра удовольствия от игры настройте роль "Russian Roulette" по вашему усмотрению.
            -ddr Принудительная очистка роли "Russian Roulette". Только для Администраторов.
            `)
            .setColor('0x0A')
        commandClear(message);
        message.reply(rrinfo);
    })

    command(bot, ['ping', 'Ping', 'PING'], (message) => {
        commandClear(message);
        const timeTaken = Date.now() - message.createdTimestamp;
        message.channel.send(`Ping ${timeTaken}ms!`);
    });

    command(bot, ['suicide', 'Suicide', 'SUICIDE', 's'], (message) => {
        let embed = createSoloAction(message, suicideGif)
        commandClear(message)
        message.reply(embed)
    });

    command(bot, ['sad', 'Sad', 'SAD'], message => {
        let embed = createSoloAction(message, sadGif)
        commandClear(message)
        message.reply(embed)
    })

    command(bot, ['simp', 'Simp', 'SIMP'], message => {
        let embed = createDuoAction(message, simpGif)
        commandClear(message)
        message.reply(embed)
    });

    command(bot, ['horny', 'Horny', 'HORNY', 'hr'], message => {
        let embed = createSoloAction(message, hornyGif)
        commandClear(message)
        message.reply(embed)
    })

    command(bot, ['kill', 'Kill', 'KILL'], message => {
        let embed = createDuoAction(message, killGif)
        commandClear(message)
        message.reply(embed)
    });

    command(bot, ['fuckyou', 'Fuckyou', 'FUCKYOU', 'fy'], (message) => {
        let embed = createDuoAction(message, fuckYouGif)
        commandClear(message)
        message.reply(embed)
    });

    command(bot, ['beat', 'Beat', 'BEAT'], message => {
        let embed = createDuoAction(message, beatGif)
        commandClear(message)
        message.reply(embed)
    });

    command(bot, ['flex', 'Flex', 'FLEX'], message => {
        let embed = createSoloAction(message, flexGig)
        commandClear(message)
        message.reply(embed)
    });

    command(bot, ['obey', 'Obey', 'OBEY'], message => {
        let embed = createDuoAction(message, obeyGif)
        commandClear(message)
        message.reply(embed)
    })

    command(bot, ['rr', 'RR', 'кк', 'КК'], message => {
        if (!message.member.roles.cache.find(r => r.name === 'Russian Roulette')) {
            if (talkedRecently.has(message.author.id)) {
                commandClear(message)
            } else {
                commandClear(message)
                let author = message.author;
                let userToMute = message.member;
                let muteRole = message.guild.roles.cache.find(r => r.name === 'Russian Roulette');
                let goldenBullet = 1000 * 60 * 60;
                let normalBullet = 300 * 1000 * 2;
                let roll = Math.random() * 100;

                if (roll < 16) {
                    let bullet = Math.random() * 100;
                    if (bullet < 10) {
                        let goldenEmbed = new Discord.MessageEmbed()
                            .setTitle("Получает Золотую Пулю в висок. Press 'F'.")
                            .setDescription(`${author} проигрывает в русскую рулетку и отсиживается в муте 1 час.`)
                            .setImage('https://media.discordapp.net/attachments/814075232448413697/814493049828016128/MpGR.gif')
                            .setColor('f7f557')

                        userToMute.roles.add(muteRole)
                        message.reply(goldenEmbed)
                        author.send("Вы проиграли в Русскую Рулетку. Вы отключены от чата на 1 час. Проведите это время с пользой.");
                        setTimeout(() => userToMute.roles.remove(muteRole), goldenBullet)
                    } else {
                        let text = getRandom(deadText)
                        let dead = new Discord.MessageEmbed()
                            .setTitle(text)
                            .setDescription(`${author} проигрывает в русскую рулетку и отсиживается в муте 10 минут.`)
                            .setImage('https://images-ext-1.discordapp.net/external/ng_j0ZA8WcSFvtdVg9-nvWOCmWmi86Ty5udL5B-TANo/https/media.discordapp.net/attachments/812992770356543501/818490309502697492/20210308_172756.gif')
                            .setColor('ff0000')

                        userToMute.roles.add(muteRole)
                        message.reply(dead)
                        setTimeout(() => userToMute.roles.remove(muteRole), normalBullet)
                    }
                } else {
                    let text = getRandom(aliveText)
                    let alive = new Discord.MessageEmbed()
                        .setTitle(text)
                        .setDescription(`${author} побеждает в русской рулетке, пока что...`)
                        .setImage('')
                        .setColor('BLACK')

                    message.reply(alive)
                }
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    talkedRecently.delete(message.author.id);
                }, 300 * 1000);
            }
        } else {
            commandClear(message)
        }
    });

    command(bot, 'ddr', message => {
        commandClear(message)
        if (message.member.hasPermission('KICK_MEMBERS')) {
            let muteRole = message.guild.roles.cache.find(r => r.name === 'Russian Roulette');
            let members = muteRole.members
            members.forEach(member => {
                member.roles.remove(muteRole)
                console.log(`Роль ${muteRole} удалена у пользователя ${member.user.username}`)
            })

        } else {
            message.reply(`Вы не администратор.`)
        }
    })

    command(bot, ['ask', 'Ask', 'ASK', 'фыл'], message => {
        commandClear(message)
        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        let survey = [];
        let messageArr = message.content.split(' ');
        messageArr.splice(0, 1);
        let msg = messageArr.toString()
        let question = msg.split('?')[0]
            .replace(/,/g,' ');
        let answersArr = msg.split('?')[1]
            .split(',,');
        answersArr = answersArr.map(i => i.split(',').filter(x => x.trim()).join().replace(/,/g,' '))

        for (let i = 0; i < answersArr.length; i++) {
            survey.push(emojis[i] + answersArr[i])
        }

        //survey.join('\n')

        let surveyEmbed = new Discord.MessageEmbed()
            .setTitle(`${question}?`)
            .setDescription(survey)

        message.channel.send({ embed: surveyEmbed }).then(embedMessage => {
            for (let i = 0; i < survey.length; i++) {
                embedMessage.react(`${emojis[i]}`)
            }
        })
    })
});


const checkRole = () => {
    servers.cache.forEach(server => {
        let id = server.id
        let guild = bot.guilds.cache.get(id).roles
        let muteRole = guild.cache.find(role => role.name === 'Russian Roulette')
        if (muteRole) {
            let members = muteRole.members
            members.forEach(member => {
                member.roles.remove(muteRole)
            })
            console.log(`Чистилище пусто, можно играть в Русскую Рулетку!`);
        } else {
            guild.create({
                data: {
                    name: 'Russian Roulette',
                    color: 'GRAY',
                },
            })
                .then(console.log)
                .catch(console.error);
        }
        if (guild.cache.find(role => role.name === 'WINNER')) {
            console.log(`Победитель найден!`);
        } else {
            guild.create({
                data: {
                    name: 'WINNER',
                    color: 'GOLD',
                },
            })
                .then(console.log)
                .catch(console.error);
        }
    })
}

const clearRole = () => {
    servers.cache.forEach(server => {
        let id = server.id
        let guild = bot.guilds.cache.get(id).roles
        let muteRole = guild.cache.find(r => r.name === 'Russian Roulette');
        let members = muteRole.members
        members.forEach(member => {
            member.roles.remove(muteRole)
            console.log(`Роль ${muteRole} удалена у пользователя ${member.user.username}`)
        })
    })
}

const createSoloAction = (message, arr) => {
    let author = message.author;
    let item = getRandom(arr);
    const embed = new Discord.MessageEmbed()
        .setDescription(`${author} ${item.text}`)
        .setImage(item.img)
        .setColor('0x0A')
    return embed
}

const createDuoAction = (message, arr) => {
    let author = message.author;
    let target = message.mentions.members.first();
    if (!message.mentions.members.first() || message.mentions.members.first().id === message.author.id) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`${author} укажите цель.`)
            .setColor('0x0A')
        return embed
    } else {
        let item = getRandom(arr);
        let embed = new Discord.MessageEmbed()
            .setDescription(`${author} ${item.text} ${target}`)
            .setImage(item.img)
            .setColor('0x0A')
        return embed
    }
};

const getRandom = (arr) => {
    let index = Math.floor(Math.random() * arr.length);
    return arr[index]
}

const commandClear = (message) => {
    message.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username} command: ${msg.content}`))
        .catch(console.error);
};

const suicideGif = [
    {
        img: 'https://media.discordapp.net/attachments/809894239265488916/809894581260124230/original.gif',
        text: 'не выдерживает тяжести этого бренного мира.'
    },
    {
        img: 'https://cdn.discordapp.com/attachments/813164101731090452/813166022633717801/ezgif-7-95308d67f59a.gif',
        text: 'не может больше терпеть и приглашает с собой.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813164101731090452/815273726663983114/mp4-10_2.gif',
        text: 'проводит по еще теплой пульсирующей руке ледяным лезвием ножа.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813164101731090452/815268544643465276/giphy_2.gif',
        text: 'решает завершить свои страдания спрыгнув с моста.'
    },
    {
        img: 'https://tenor.com/view/anime-sad-death-suicide-gif-5091706',
        text: 'делает последний в своей жизни шаг - шаг в бездну.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/jw6dgDue0iUiYTDhfnqOBKsb07zOEDqhN5Ii0HkFvs4/https/images-ext-1.discordapp.net/external/YKccMYfV4CmfFEqfNoIL0fPJo4sMWGD5_MWLFqxRyng/https/im7.ezgif.com/tmp/ezgif-7-f011470a027f.gif',
        text: 'следует зову чести.'
    },
    {
        img: 'https://media.discordapp.net/attachments/809894239265488916/809894582514876416/tumblr_mf3u29fpef1rkmjjzo1_500.gif',
        text: 'принимает слишком много викодина.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813164101731090452/815268562242895962/mp4-9_2.gif',
        text: 'медленно поднимается на эшафот ручной работы'
    },
    {
        img: 'https://media.discordapp.net/attachments/809894239265488916/809894582871523398/1520256751_EquatorialGleefulArabianhorse-size_restricted.gif',
        text: 'проветривает голову.'
    },
    {
        img: 'https://media.discordapp.net/attachments/809894239265488916/809894581260124230/original.gif',
        text: 'в последнюю секунду своей жизни слышит лязг курка.'
    },
    {
        img: 'https://media.discordapp.net/attachments/809894239265488916/809894574994096141/3530ac9cef873181afc7f9d36d0ce101.gif',
        text: 'держа в руках ножницы, решает все закончить.'
    },
    {
        img: 'https://cdn.discordapp.com/attachments/813164101731090452/813478640561422399/ezgif-7-aa65e7d0bdd4.gif',
        text: 'в припадке безумия режет свое горло.'
    },
    {
        img: 'https://cdn.discordapp.com/attachments/813164101731090452/813452277749907486/193763.gif',
        text: 'выплюнула крыша.'
    },
    {
        img: 'https://i.pinimg.com/originals/c2/b5/59/c2b559b24177ee088bed03dbb77abce2.gif',
        text: 'кривя рот от боли, вонзает себе в голову нож.'
    },
    {
        img: 'https://cdn.discordapp.com/attachments/813164101731090452/813340793921601576/ezgif-2-76117f1d737b.gif',
        text: 'курлыкнулся.'
    },
    {
        img: 'https://cdn.discordapp.com/attachments/813164101731090452/813340394233659402/ezgif-2-916f04f275d4.gif',
        text: 'расставив руки в свободном падении, считает секунды до смерти.'
    },
    {
        img: 'https://cdn.discordapp.com/attachments/813164101731090452/813176070266290176/ezgif-2-5e8274138e61.gif',
        text: 'скрепляет кровью сделку со смертью.'
    },
    {
        img: 'https://data.whicdn.com/images/236330260/original.gif',
        text: 'умирает, вскрыв вены в ванной. Классика.'
    },
    {
        img: 'https://pa1.narvii.com/6611/38ab74955005affffd2aa92d0b7aa61c82835f08_hq.gif',
        text: 'закрыв заплаканные глаза, прыгает вниз.'
    },
    {
        img: 'https://data.whicdn.com/images/281398207/original.gif',
        text: 'шагает в бездну.'
    },
    {
        img: 'https://cdn.discordapp.com/attachments/813164101731090452/813166843606204490/ezgif-7-318f388a770c.gif',
        text: 'заливает весь пол своей кровью.'
    },
    {
        img: 'https://media.discordapp.net/attachments/809894239265488916/809894583991402536/tumblr_mo1ef0QwUS1s0pcfao1_500.gif',
        text: 'из последних сил хрипит, качаясь на веревке.'
    },
    {
        img: 'https://media.discordapp.net/attachments/809894239265488916/809894583965057044/182832337001202.gif',
        text: 'перестает бороться за жизнь.'
    },
    {
        img: 'https://media.discordapp.net/attachments/809894239265488916/809894581930819584/182542841000202.gif',
        text: 'не обращая внимания на боль, вгоняет нож себе в горло.'
    },
]
const simpGif = [
    {
        img: 'https://images-ext-1.discordapp.net/external/vIDZxpGDtAEa1Y97ry1cjsyiH2xbndR4R3i2HDKXQSk/https/i.gifer.com/FAPk.gif',
        text: 'трясется, думая о'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/hGD3EDhT7fzeVL3YkMqb-Uv0pm_hnYh-Ykn6QWIILb4/https/media.discordapp.net/attachments/812992770356543501/813798156553682964/20210223_184305.gif',
        text: 'сходит с ума от чувств к'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/PJUCqtbUL5thYGrXEJyORcGzlU0qIlsCGmGM7lhbdWQ/https/i.pinimg.com/originals/1e/7d/79/1e7d79e5290539412e2a723652cf86bb.gif',
        text: 'сделает что угодно, лишь бы быть рядом с'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/abpnXhJekf02QUdZzlFotAurHAiiWzTd9OwFd0p8y-8/%3Fitemid%3D12858461/https/media1.tenor.com/images/1ce4f3195a34951af451412f385ec30a/tenor.gif',
        text: 'не может представить ни секунды своей жизни без'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/ww8H7O5mRCWz12zWzROCS8ht1epGePUnNr5_ODuBrBM/https/pa1.narvii.com/6201/2384784dcd395eb79dff350baa91b27bb00341e1_hq.gif',
        text: 'убьет каждого, кто прикоснется к'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/Zx3X-vk1QpuA65xJ-BB7R1WrGgRqOAeS9QlQtOubAuI/https/images6.fanpop.com/image/photos/36000000/Yandere-Anime-Characters-image-yandere-anime-characters-36095894-500-284.gif',
        text: 'дьявольски улыбается, наблюдая за'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/R2R41zoHw19AF0f1aKboJBmEFsmjlu5rvQCEPoJMNTM/https/data.whicdn.com/images/332383641/original.gif',
        text: 'испытывает нездоровые чувства'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/s7ONmeC-epBZDQtNvavhQc34_4r8lrykz1SbxUcwfHI/https/pa1.narvii.com/5810/81ce35d3b790971cf5337fbc786955ed7280a95f_hq.gif',
        text: 'жадно облизывается, смотря в глаза'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/XTcxkQZhd90bFyrw-CAo9bOwDpJrwVxD_mVdU3SIVFM/%3Fitemid%3D15385352/https/media1.tenor.com/images/7bb1a4740a3b71052e1323be9385e6d5/tenor.gif',
        text: 'расплывается в бредовых мыслях о жизни с'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/WEwPM7jlYpXituzGEn976krRMdgbfa05nsuwXQ6UZ0U/https/i.pinimg.com/originals/a2/76/1e/a2761e9386905482c8dd66372f9e1a02.gif',
        text: 'трясется и хохочет от чувств к'
    },
    {
        img: 'https://media.discordapp.net/attachments/813353699304538143/813432522645176360/giphy.gif',
        text: 'сверкающими глазами смотрит на'
    },
    {
        img: "https://media.discordapp.net/attachments/813353699304538143/817524074116153364/20210306_012822.gif",
        text: "рассказывает о своих сладких мечтах милому"
    },
    {
        img: "https://media.discordapp.net/attachments/813353699304538143/817524598077784085/giphy_1.gif",
        text: "делится своими влажными фантазиями с"
    },
    {
        img: "https://media.discordapp.net/attachments/813353699304538143/817524672127827988/tenor_3.gif",
        text: "не видит никого кроме"
    },
    {
        img: "https://media.discordapp.net/attachments/813353699304538143/817524720076849152/tenor_2.gif",
        text: "смущается при виде"
    },
    {
        img: "https://media.discordapp.net/attachments/813353699304538143/818579986780782642/tenor_3.gif",
        text: "замечает своего симпа"
    },
    {
        img: "https://media.discordapp.net/attachments/813353699304538143/818580026726940712/tenor_2.gif",
        text: "не видит никого кроме"
    },
    {
        img: "https://media.discordapp.net/attachments/813353699304538143/818580143030403082/tenor_1.gif",
        text: "хочет как можно больше прикасаться"
    },
    {
        img: "https://media.discordapp.net/attachments/813353699304538143/818583272488960040/20210308_233718.gif",
        text: "влюбленно смотрит на"
    },
    {
        img: "https://media.discordapp.net/attachments/813353699304538143/818583304814854174/20210308_233530.gif",
        text: "радуется сообщению от"
    },
]
const fuckYouGif = [
    {
        img: 'https://media.discordapp.net/attachments/762328928466763817/781961526490693652/2212.gif',
        text: `обучается cinema 4d и посылает нахуй`
    },
    {
        img: 'https://media.discordapp.net/attachments/761587185866506270/812492762808320060/20210220041609409.gif',
        text: `графично посылает нахуй`
    },
    {
        img: 'https://media.discordapp.net/attachments/796859043359752203/813741878100885504/20210223_145915.gif',
        text: `посылает нахуй`
    },
    {
        img: 'https://media.discordapp.net/attachments/796859043359752203/813743023544205352/20210223_150348.gif',
        text: `посылает нахуй`
    },
    {
        img: 'https://media.discordapp.net/attachments/796859043359752203/813744239589851176/20210223_150833.gif',
        text: `отправляет весточку`
    },
    {
        img: 'https://media.discordapp.net/attachments/796859043359752203/813745266335285298/20210223_151243.gif',
        text: `посылает нахуй`
    },
    {
        img: 'https://media.discordapp.net/attachments/761587185866506270/809805654474752061/image0.gif',
        text: `классическим образом посылает`
    },
    {
        img: 'https://media.discordapp.net/attachments/796859043359752203/813746705837195295/20210223_151830.gif',
        text: `задает направление для`
    },
    {
        img: 'https://media.discordapp.net/attachments/796859043359752203/813749578548379708/20210223_152952.gif',
        text: `получает в обратку от`
    },
    {
        img: 'https://media.discordapp.net/attachments/796859043359752203/813752196813553684/20210223_154014.gif',
        text: `посылает нахуй`
    },
    {
        img: 'https://media.discordapp.net/attachments/796859043359752203/813753384476868648/20210223_154459.gif',
        text: `просит выполнить просьбу`
    },
    {
        img: 'https://media.discordapp.net/attachments/796859043359752203/813756053090205717/20210223_155457.gif',
        text: `отправляет подарочек`
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/_OdKuNnalZa-ck2on3zPFVucAD-PTlcijSRO8wt--OA/https/media.discordapp.net/attachments/796859043359752203/813772918093119548/20210223_170220.gif?width=605&height=468',
        text: 'зарабатывает первый косарь благодаря'
    },
    {
        img: 'https://media.discordapp.net/attachments/813342002136612894/813775282204180561/20210223_171038.gif',
        text: 'посылает нахуй по хохлятски'
    },
]
const killGif = [
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/814079034211434536/mp4.gif',
        text: 'легким движением руки, как будто делал это сотни раз, отсекает голову'
    },
    {
        img: 'https://media.giphy.com/media/l4Jz8aaFug1YDh49q/giphy.gif',
        text: 'давай!! ДАВАААЙ УРАА ДАВААЙ ДААВАААЙ'
    },
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/814079595144937492/tenor.gif',
        text: 'трясущимися от ярости руками, вонзает окровавленные ножницы в голову'
    },
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/814079901464002603/tenor_1.gif',
        text: 'твердой рукой взводит курок, и под громкий звук вылетевшей пули, на несколько метров отлетает тело'
    },
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/814080259870818325/tumblr_mm8yztHCC51spox3yo1_500.gif',
        text: 'не оглядываясь, отрывает голову от шеи'
    },
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/814080511927648266/tenor_2.gif',
        text: 'хладнокровно перерезает горло'
    },
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/814080721127473172/tenor_3.gif',
        text: 'орудует ножами так, будто перед ним кусок курицы, а не'
    },
    {
        img: 'https://data.whicdn.com/images/290469909/original.gif',
        text: 'облизывает с губ кровь'
    },
    {
        img: 'https://thumbs.gfycat.com/AdvancedJampackedDungenesscrab-size_restricted.gif',
        text: 'с довольной ухмылкой опускает оружие, смотря на бездыханное тело'
    },
    {
        img: 'https://i.pinimg.com/originals/4a/7a/52/4a7a5282df4e304f36b7d5305374b871.gif',
        text: 'не обращая внимания на льющуюся фонтаном кровь, продолжает вонзать нож в'
    },
    {
        img: 'https://i.gifer.com/XUsh.gif',
        text: 'подставляет нож к горлу'
    },
    {
        img: 'https://49.media.tumblr.com/b6e35a3a7e1c2c1c31ab32c3459332a3/tumblr_o0lbjtC84K1qimk8ao2_r1_540.gif',
        text: 'пачкает весь пол кровью'
    },
    {
        img: 'https://99px.ru/sstorage/86/2017/04/image_8615041712250676674.gif',
        text: 'в припадке безумия вонзает нож прямо в'
    },
    {
        img: 'https://media1.tenor.com/images/0304cf80269c43d51bab9554c04435e9/tenor.gif?itemid=5541092',
        text: 'разрубает на две части окровавленное тело'
    },
    {
        img: 'https://pa1.narvii.com/6201/ff017da01dd64d601da8352ce983f1c3f03fa68e_hq.gif',
        text: 'протыкает ножом насквозь'
    },
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/814080930397945907/tenor_4.gif',
        text: 'довольно вытирает с одежды кровь'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/nppvAag0utcZnvcpQ6j_KUlYGLINUwSvd55WjJUsg_Q/https/data.whicdn.com/images/282133833/original.gif',
        text: 'не стерпел существования'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/hojLguH69xaouajhuLj3eZb89Ku754ib6QWnjPbRUts/https/i.gifer.com/origin/c3/c38145290bf09452dc4dfc7fd1e4d0a2.gif',
        text: 'мстит за все обиды'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/nUpNVjJTAzrmQvSV5wxtFijMxQOAfDYSlCbXDUUC44I/https/i.pinimg.com/originals/74/96/34/74963498f7e64f76c36e42a3dd18bd98.gif',
        text: 'мстит за все обиды'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/8rtcyGpozlGMIDaljwpJuTaPn0ShUu_jDKniWaK4SoM/https/www.usanimedirect.com/wp-content/uploads/2016/10/Corpse-Party.gif',
        text: 'мстит за все обиды'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/L-GxLhrg_SwQ7aPAf6N9C8G-WL_VBMtko8day9dKHJk/https/media.discordapp.net/attachments/761587185866506270/813424592831250473/tenor.gif',
        text: 'весь пачкается в крови'
    },
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/813427717336334396/tenor_3.gif',
        text: 'вместо Кибердеда убивает'
    },
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/813428208187605022/tenor_4.gif',
        text: 'не вынес существования'
    },
    {
        img: 'https://media.discordapp.net/attachments/813013380419551262/813432192185139200/Dominator-eliminator.gif',
        text: 'уничтожает мразь'
    },
]
const flexGig = [
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865516648366120/12.gif',
        text: 'показывает всем кто здесь папочка.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865546226335754/22.gif?width=468&height=468',
        text: 'демонстрирует свою ярость.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865577386868807/23.gif?width=468&height=468',
        text: 'чрезвычайно силён.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865623125884958/24.gif',
        text: ', вот это мускулы!'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865637952487434/27.gif',
        text: 'спокойно показывает свою силу.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813758043010498591/815892474437435422/anime-minecraft.gif',
        text: 'по приколу превратился в квадратного Синдзи.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865694273470504/11.gif',
        text: 'показывает всем свою национальную принадлежность.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865749181235280/456.gif',
        text: 'нечеловечески зол!'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865798372032542/65443.gif',
        text: 'показывает кто здесь самый главный.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865815744053298/3254122.gif',
        text: ', словно хищник ищет свою жертву.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813865836220776458/BVlW.gif?width=312&height=468',
        text: 'позирует перед всем чатом.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866048674857000/DXwD.gif',
        text: 'указывает тебе на твоё место.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866300157067331/IU4p.gif',
        text: 'смущённо улыбается.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866371796434955/de3ms6e-5f5bff6e-a5f3-4cca-8869-7ef3c39f5330.gif?width=832&height=468',
        text: 'превратился в волчару!'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866437596545086/2131.gif?width=468&height=468',
        text: 'мило улыбается.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866451982352384/352.gif',
        text: 'подмигивает чату.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866467337830410/123123.gif?width=322&height=468',
        text: 'нереально крут.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866508702580766/1234.gif',
        text: 'монструозно крут.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866541468614697/13.gif',
        text: 'накачал мощные груди.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866562066186290/9y5f.gif',
        text: 'невероятно красив и мужественен.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866605674102794/124123.gif',
        text: 'показывает всем мощь своих рук.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866625077608479/12345.gif',
        text: 'сейчас лопнет от напряжения.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866641406033970/123124.gif?width=401&height=468',
        text: 'показывает свою лучшую улыбку.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866723215409243/-0986.gif?width=319&height=468',
        text: 'готов разорвать вселенную.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866738865012796/654.gif',
        text: '... Ну, по крайней мере у тебя чёткие кудряшки!'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866801414668288/4123431.gif',
        text: 'затмевает собой солнце.'
    },
    {
        img: 'https://media.discordapp.net/attachments/815295616829489172/818220284875505714/c1e.gif',
        text: 'ебанул кашу "Геркулес"'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866879134859334/26.gif',
        text: 'сам не может поверить в то, насколько он крут.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866942481563648/1324.gif',
        text: 'тренируется крошить черепа.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813866972232024094/987.gif',
        text: 'подготавливается к сеансу флексинга.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813867003810152459/214.gif',
        text: ', член, залогинься...'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813867031962189903/145.gif',
        text: 'превратился в крутого казаха.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813867083208196126/25.gif?width=374&height=468',
        text: 'кричит от ужаса, он потерял свои мышцы!'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813867095133257778/1G2fPui.gif',
        text: 'разминает атласные плечи перед решающим заплывом. '
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813867304928018432/hfgh.gif',
        text: 'подмигивает чату.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813867358811586660/fdsfd.gif?width=415&height=468',
        text: 'абсолютно уверен в себе.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813867715575021578/dfzdfv.gif',
        text: 'показывает свою лучшую улыбку.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813868339239059487/sdfdzfsv.gif',
        text: 'превратился в супергероя ради флексинга.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813868356225990656/jhgfd.gif',
        text: 'позирует перед всем чатом.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813757848788926484/813868381958438943/8bIF.gif',
        text: '... Ну, по крайней мере у тебя чёткие кудряшки!'
    },
    {
        img: 'https://media.discordapp.net/attachments/813758043010498591/813866132715864094/21345.gif',
        text: 'готовит флекс.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813758043010498591/813868881596645396/7654.gif',
        text: 'пробует флекс на вкус.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813758043010498591/813869061318508544/765456.gif',
        text: 'источает колоссальную безумную ярость горящей бездны.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813758043010498591/813869288796455013/4567.gif?width=627&height=468',
        text: 'стал Мистером Вселенная ради флекса.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813758043010498591/818602175944458262/tenor_1.gif',
        text: ', Куропа, залогинься'
    }
]
const obeyGif = [
    {
        img: 'https://media.discordapp.net/attachments/813450632328773673/813451057626611732/193764.gif',
        text: 'владеет телом'
    },
    {
        img: 'https://media.discordapp.net/attachments/813450632328773673/813457014667608125/ezgif-6-06ade49be640.gif',
        text: 'хвалит свою сучку'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/Zl96TKPy_zumAGrB3xVfXrhwwr8Wtde2z0Kladi4j1g/https/i.skyrock.net/7536/96837536/pics/3272049128_1_2_UX0js1zo.gif',
        text: 'подчиняет своей воле'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/D5Z60qt9YQjXNxvIOMSjXgD-CRPpRDHYFAdwhjM0flA/https/anime-chan.me/uploads/posts/2016-04/1460037330_anime-mitsuko-yokoyama-anime-adult-gifki-anime-adult-3005267.gif',
        text: 'связывает в технике шибари'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/7ceV7cEzQjXQCcMpqWz1xGAvO5OWwAfsF8Ea399njb8/http/25.media.tumblr.com/e5ee2a0bf9fefc6e61f5cf7b9dcd78f9/tumblr_mua8stxRjC1r8oyaho1_500.gif',
        text: 'ломает волю'
    },
    {
        img: 'https://media.discordapp.net/attachments/813450632328773673/813461218886942720/193765.gif',
        text: 'доминирует над'
    },
    {
        img: 'https://media.discordapp.net/attachments/813450632328773673/813465125863686155/33abd3b862c24354bdc44056cebd24b6.gif',
        text: 'топчет не только достоинство'
    },
    {
        img: 'https://media.discordapp.net/attachments/813450632328773673/813466612245463090/1517777728_aaaaa.gif',
        text: 'желает отхлестать по попке'
    },
    {
        img: 'https://media.discordapp.net/attachments/813450632328773673/813470387119587338/ezgif.com-gif-maker_1.gif',
        text: 'унижает грязного раба'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/pPzXwijx-r9qBGcG0asT3k1Zax1v8-3fH0UZCvFDdFw/https/66.media.tumblr.com/88847d3c9bba5cf951dc735e88dbea29/tumblr_oam9yf1iSU1v2hfg0o3_500.gif',
        text: 'готовится овладеть '
    },
    {
        img: 'https://media.discordapp.net/attachments/813450632328773673/813490540909035520/1.gif',
        text: 'будет делать все что захочет с'
    },
    {
        img: 'https://media.discordapp.net/attachments/813450632328773673/813490543085879316/3.gif',
        text: 'ловит в садистские сети'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/WcXUe1S_C1TQyrrBIqHx4l2IEukduujx8CXT_G_bB9I/https/media.discordapp.net/attachments/813429324706873344/813448392276836383/193757.gif',
        text: 'любит пoжёcтчe наслаждаться телом'
    },
    {
        img: "https://media.discordapp.net/attachments/813450632328773673/817526516279672882/giphy_1.gif",
        text: "связав, держит в своем подвале, бедняжку"
    }
]
const beatGif = [
    {
        img: 'https://images-ext-2.discordapp.net/external/6eE-wlNUIZomUmNUpsr8xRIXpGPaa8xoW6Miopkf018/http/68.media.tumblr.com/48a458b6895940d1096da1a1cffca9ae/tumblr_nbehwr9Eow1s3wjuno1_400.gif',
        text: 'жестоко хуячит дубинкой по голове'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/nPLD4SOGAtxLLo78GXdv0IUzupL8fXyvQ5Oq3XfhRUg/https/i.pinimg.com/originals/1b/99/51/1b995167a81d4d97cef89d76b98667e8.gif',
        text: 'отвешивает смачную оплеуху'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814427828161609728/Levi_kicking_the_shit_out_of_Eren.gif',
        text: 'до полусмерти забивает ногами'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814427829261434880/mp4-7.gif',
        text: 'готовится ударить битой по голове'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814429292113035274/mp4-9.gif',
        text: 'стирает в пыль'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814429292464701450/mp4-10.gif',
        text: 'снова дерется по пьяне с'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814429293051641856/mp4-18.gif',
        text: 'крошит черепушку'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814429796654252042/mp4-19.gif',
        text: 'с чудовищной силой пиздит'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814430179933945877/mp4-13.gif',
        text: 'наносит серию ударов по лицу'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814429796968693770/mp4-22.gif',
        text: 'заряжает с вертухи по'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814430180290068480/mp4-16.gif',
        text: 'боксирует с головой'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814429797349851147/mp4-17.gif',
        text: 'мощными ударами вырубает'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/814430606989197342/giphy-2.gif',
        text: 'отчаянно пиздится с'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/pHAD9RMFv9jHo2QuQoEvJAcCvYtO_5XMJA2QNcf4pGw/https/i.pinimg.com/originals/56/7f/0a/567f0abf02dbf640896b1680f998399e.gif',
        text: 'забивает до беспамятства'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/815268331426545694/mp4-8_1.gif',
        text: 'с безумной всепоглощающей яростью наносит сокрушительные удары по'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/815268283237269504/mp4-5.gif',
        text: 'продолжает избивать обмякшее тело'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/815268299881316382/mp4-6.gif',
        text: 'ломает рёбра'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/815268318034132992/mp4-7_2.gif',
        text: 'одним разрушительным ударом заканчивает драку с'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/1O7WqNfFhYubj-LLJKGo9wlyzeDKtqriIXbOht73WWk/%3Fitemid%3D13692697/https/media1.tenor.com/images/b7125a35cce2937987858d8ac5137798/tenor.gif',
        text: 'няшит до полусмерти'
    },
    {
        img: 'https://media.discordapp.net/attachments/813429324706873344/815268263457587231/Tu_amigo_te_muestra_10.gif',
        text: 'яростно ломает спину'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/iOGZ0Am511b4yLcUTJVs-f753NWwhsVjoh1DIUYKc9A/https/i.gifer.com/LWIK.gif',
        text: 'с максимальной жестокостью и неописуемой яростью борется насмерть с'
    },
]
const sadGif =[
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814058082036350986/tenor_2.gif',
        text: 'глотает слезы от обиды.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814058306422964234/tenor_3.gif',
        text: 'глушит крик в сердце.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814058932933885973/tenor_6.gif',
        text: 'не знает что делать дальше.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814059956046659644/tenor_10.gif',
        text: 'глушит крик в сердце.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814060551314735154/tenor_11.gif',
        text: 'не знает как быть дальше.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814060717166297148/tenor_12.gif',
        text: 'заедает депрессию.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814060837613600788/tenor_13.gif',
        text: 'грустит в одиночестве.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814061194976559104/tenor_14.gif',
        text: 'не может сдержать слезы.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814440164599791636/mp4-7_1.gif',
        text: 'печально ждет объятий.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814440164884480010/mp4-8.gif',
        text: 'печально ждет объятий.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814440165094981682/mp4-9_1.gif',
        text: 'не справляется с самим собой.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814440790826680381/mp4-10_1.gif',
        text: 'прячет слезы в дожде.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814440791119757322/SchoolDays.gif',
        text: 'ждет сообщения, которое никогда не придет.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814440791539843082/mp4-12.gif',
        text: 'ждет сообщения, которое никогда не придет.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814441360999972894/mp4-13_1.gif',
        text: 'осознает степень своего отчаяния.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814441361427922974/mp4-14.gif',
        text: 'ждет сообщения, которое никогда не придет.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814441361767137290/mp4-17_1.gif',
        text: 'печально ждет объятий.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814442133774794812/mp4-20.gif',
        text: 'не знает как быть дальше.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814442134086090752/mp4-18_1.gif',
        text: 'ощущает безумное одиночество.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814442134357934100/mp4-21_1.gif',
        text: 'не знает как быть дальше.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814442943444025344/mp4-16_2.gif',
        text: 'отворачивается от всего мира.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814442943754010624/mp4-25_1.gif',
        text: 'не видит смысла в этой ежедневной рутине.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814442944207126548/mp4-11_2.gif',
        text: 'думает над бренностью бытия.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814443867134361641/mp4-22_1.gif',
        text: 'плачет вместе с небом.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814443867457060864/giphy_1.gif',
        text: 'не может сдержать свою грусть.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814443867696529458/giphy-1_1.gif',
        text: 'злится из-за обиды на себя.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814444532594245632/giphy-2_1.gif',
        text: 'не может сдержать слезы.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814444532850229258/giphy-4.gif',
        text: 'не может сдержать слезы.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814445136591061032/giphy-5.gif',
        text: 'не знает как быть дальше.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814445137345773568/giphy-7.gif',
        text: 'прячет слезы в дожде.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814445754655178813/giphy-8.gif',
        text: 'хочет поддержки друзей.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814445754998456320/giphy-9.gif',
        text: 'сомневается в себе.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814445755213152306/giphy-10.gif',
        text: 'хочет поддержки друзей.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814447290160119838/giphy-19.gif',
        text: 'укрывается от всего мира.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814447290453852170/giphy-20.gif',
        text: 'прячет слезы в дожде.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814447291028602930/giphy-17.gif',
        text: 'не может изменить ничего.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814447809075085352/giphy-27.gif',
        text: 'злится от обиды на себя.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814448342117384233/giphy-15_1.gif',
        text: 'глушит крик в душе.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814448342381232148/giphy-11_1.gif',
        text: 'не сдерживает крик отчаяния.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814449028938596362/giphy-18.gif',
        text: 'ждет сообщения, которое никогда не придет.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814449029311102976/giphy-14.gif',
        text: 'плачет вместе с небом.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814449837226590248/giphy-23.gif',
        text: 'кричит от безысходности.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814449837470253066/giphy-29.gif',
        text: 'тихо плачет.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814453413734514728/giphy-25_1.gif',
        text: 'глотает слезы обиды.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814453414380568626/giphy-32_1.gif',
        text: 'просто хочет исчезнуть.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814453702135119911/giphy-38.gif',
        text: 'устал считать -7.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814453702488227880/giphy-36.gif',
        text: 'задыхается от обиды.'
    },
    {
        img: 'https://media.discordapp.net/attachments/814057694809817098/814453702722977832/giphy-35.gif',
        text: 'не знает как быть дальше.'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/ciBn3lNJzvN5sPhUhDHcCJB8Vt2BBkB5ZPxwl6brOco/https/media.discordapp.net/attachments/416224753859428354/734878436689969162/ofai.gif',
        text: 'устал от всего этого и пьет певко.'
    }
]
const hornyGif = [
    {
        img: 'https://images-ext-2.discordapp.net/external/A-zHfKkxwYBr-p3pj3mYuKqnOWNTrVF241bcG5e9E3Q/%3Fitemid%3D15788928/https/media1.tenor.com/images/f1a88df49dbb46281a37751df8b495bf/tenor.gif',
        text: 'сдавленно постанывает и расплывается в похотливой улыбке.'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/qS6-4OQchJRUn4jx4alF2n4dQAOcv00JVcn_IpUY5DQ/%3Fitemid%3D19517761/https/media1.tenor.com/images/6be5a0409be264447d9dbc90ad139569/tenor.gif',
        text: 'жадно облизывается, прокручивая в голове самые смелые фантазии.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/49D5aCLsDZTBeg7eTuQJP1GZlgB2N6Nx9d95KF7V1q8/%3Fitemid%3D19000449/https/media1.tenor.com/images/2fd47bce43f04f87bcc89ac4165c6a63/tenor.gif',
        text: 'увлеченно играет со своим телом.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/sA54rTjmT7Ok-hIZzMLkw69Bk49kUBRvVuvOFSRULQs/%3Fitemid%3D9353009/https/media1.tenor.com/images/a0ec6267a7db154a7efaa0c7be1cf752/tenor.gif',
        text: 'перебирает ногами в предвкушении.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/ns8Ty7FlywmOCL8kHl01lQ9JL8Twq6uzFchMbn_bFuM/%3Fitemid%3D18441032/https/media1.tenor.com/images/f48981a12cdc51acbbb079524da2c853/tenor.gif',
        text: 'краснеет от своих же грязных мыслей.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/nbw1Hf8AVf_6nVAIEhG8GN_3wAr8DKA1TFCvN7AdOLw/https/49.media.tumblr.com/35199df5f57d766fb2471bc773c88403/tumblr_o12dfuTdbv1v5nygdo1_500.gif',
        text: 'улыбается, словно поглощенный похотью'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/VlUm_eEnUubDCbHcQG5USSHZc1q2DzCVx0qPLjApFh0/https/media.discordapp.net/attachments/761587185866506270/815878788469620776/150beaca7524aea6cd6f3a14b1b777da.gif',
        text: 'лижет палец, старательно работая языком.'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/MWUL8gNUlv92-IVlggZW7yDWbByGCyM1CHOfqF2dCQg/https/c.radikal.ru/c01/2003/c0/62e3ff430107.gif?width=624&height=468',
        text: 'забывает, что это всего лишь перила.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/Y21vM1I3MB29f5dmeLb5Cb2yogAa0oanK8EEDG2nDy0/%3Fitemid%3D14002773/https/media1.tenor.com/images/efd46743771a78e493e66b5d26cd2af1/tenor.gif',
        text: 'забывшись в похотливых мечтах, облизывает своего симпа.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/W2GRIOZ9L0kzJ8QyWjSVKomJFaJCDQwYayk6s8O68Vc/%3Fitemid%3D4838351/https/media1.tenor.com/images/708710074e3339617e1b90ffb99683dd/tenor.gif',
        text: 'поглаживает себя. Как жаль, что рядом никого нет.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/gPJrTyYPZer6py9EZPIts-XpSVCpAYRgJRsO7oAW0r8/%3Fitemid%3D5070299/https/media1.tenor.com/images/a90264f34cc1d91775fb96cbca280062/tenor.gif',
        text: 'хищным взглядом смотрит на людей вокруг, выбирая, с кем бы осуществить свои грязные желания.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/GEziXIiB1fyAIwjeXQmPBv1VgKhVUKY93R097fXmflk/%3Fitemid%3D20558137/https/media1.tenor.com/images/f11d35de952baa84f42df54492b09c8d/tenor.gif',
        text: 'пришел с салфетками и готов убить чат.'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/PHZEgUiooF0ac9gyQzJXw3GlGav2ZcCQzLPYXxuq95s/%3Fitemid%3D16556305/https/media1.tenor.com/images/347d9b15ed6f7983d9807278f6aa12b2/tenor.gif',
        text: 'уходит в мир сексуальных фантазий.'
    },
    {
        img: 'https://images-ext-1.discordapp.net/external/m91KOWkLLX5H4QkGhDDRSCGP2NDFF-cTrWGei5UK2lI/%3Fitemid%3D13721470/https/media1.tenor.com/images/8799b0581cd611e0bbebd77b1fc4962a/tenor.gif',
        text: 'в порыве похоти облизывает губы.'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/I43XTCGLxABBsPVUdtQIqO0E_hWrCRa4IJSn836CMbk/%3Fitemid%3D12748963/https/media1.tenor.com/images/b24c28e311276be042245e5d5f37f2e2/tenor.gif',
        text: ', это, конечно, не чужие губы, но ты ведь сейчас один.'
    }, {
        img: 'https://images-ext-2.discordapp.net/external/3J6A0bwJCSqJp5WRI0VEqTJ6DmC7sGjVMPzMgsgJ9mw/%3Fitemid%3D14143763/https/media1.tenor.com/images/59d38bef819b04a2d40a40dedf0ba6d1/tenor.gif',
        text: 'извержение хорни вайбов.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815891906575466506/mp4-18_2.gif',
        text: 'недвусмысленно намекает. кто-нибудь, составте ему сегодня ночью компанию.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815891933104177153/mp4-20_1.gif',
        text: 'дрожит в предвкушении.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815891969359216650/mp4-19_1.gif',
        text: 'трясется и пытается совладать со сбившимся от похоти дыханием.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815891994856521738/mp4-15.gif',
        text: ', это просто забор и ручка, нельзя же быть таким хорни.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815892019263832064/mp4-22_2.gif',
        text: ', ты выбил любимую гифку Филина. Напиши ему, он скучает.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815892039278395472/mp4-23.gif',
        text: 'сжимается и краснеет от неловких желаний.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815892062141546536/mp4-11_3.gif',
        text: 'прокручивает в голове сюжеты из хентая.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815892092949102622/mp4-14_1.gif',
        text: 'тренируется покорять девушек на вишенке.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815892132694065152/oh_stop_it.gif',
        text: 'мило покрывается румянцем, отгоняя от себя развратные мысли.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815892148909113374/mp4-28.gif?width=454&height=468',
        text: 'даже не пытается скрыть пошлое выражение лица.'
    },
    {
        img: 'https://media.discordapp.net/attachments/813461887856803880/815892165531140127/mp4-30.gif',
        text: 'уподобляется в своей похоти животному.'
    },
    {
        img: 'https://images-ext-2.discordapp.net/external/1deIZWOBSLkQgW4nYhDVZ8zPbvVkk9NEcSFptmNT97k/%3Fitemid%3D20370777/https/media1.tenor.com/images/f920d4a08057cf24cba675e27b306b03/tenor.gif',
        text: 'я понимаю, что ты отчаялся, но не сношать же стены.'
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817521701406638111/giphy_1.gif",
        text: "пришлось связать, что бы остановить всплеск похоти."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817522655771099206/giphy-5_1.gif",
        text: "облизывается вспоминая вчерашнюю ночь."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817522656076365895/giphy-3_1.gif",
        text: "приманивает к себе."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817522656466829372/giphy-4_1.gif",
        text: "играет с душем."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817522656999899166/giphy-2_1.gif",
        text: "тяжело дышит, от чего?"
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817523406366572594/tenor_8.gif",
        text: "больше не контролирует свою похоть."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817523407079997440/tenor_7.gif",
        text: "гладит свой \"хвостик\"."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817523429468798986/tenor_5.gif",
        text: "рефлекторно повторяет заученные движения."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817523431581941810/tenor_4.gif",
        text: "любит быть сверху."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/817523432060616724/tenor_3.gif",
        text: "соблазнительно танцует демонстрируя свое тело."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/818612382954684426/tenor_9.gif",
        text: "делится своими фантазиями."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/818612445584031795/tenor_8.gif",
        text: "в предвкушении времени для игр."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/818612483727818782/tenor_7.gif",
        text: "ждет дикпиков в лс."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/818612517383045181/tenor_6.gif",
        text: "тонет в развратных мыслях."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/818612566317072404/tenor_5.gif",
        text: "предлагает перейти от слов к действию."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/818612604901261322/tenor_4.gif",
        text: "сходит с ума от похоти."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/818613517842251776/20210309_013725.gif",
        text: "по тихому трогает девочек в чате."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/818617764603363368/20210309_015351.gif",
        text: "уже в полной готовности."
    },
    {
        img: "https://media.discordapp.net/attachments/813461887856803880/818618472203812864/20210309_015640.gif",
        text: "ждет своего саба для команды -obey."
    },
]

const deadText = [
    'Оо, повезло повезло.',
    'Жалкое зрелище.',
    'Ублюдок, ты забрызгал остальных участников своей кровью.',
    'Повезло! Твои мозги на стене.',
    'Пуля разнесла твою голову.',
    'Упс, кто заказывал фарш?',
    'Тебя распидарасило от выстрела.',
    'Салют из мозгов.',
    'Придется выносить твое никчемное тело.',
    'Обретает вечный покой.',
    'Ещё некоторое время дёргается в конвульсиях после выстрела.',
    'С грохотом падает на землю, заливая темно-красной кровью пол.',
    'Оставляет в этом мире свой гниющий труп.',
    'Потерял голову.',
    'Теперь дырявый не только снизу.',
    'Готов отправиться в морг.',
    'Наконец заткнулся.',
    'Позволил нам всем облегченно вздохнуть.',
    'Сдох, ну и кто будет убирать это дерьмо?',
    'Многие наверняка завидуют тебе.',
    'Фу, как неприлично, ты мне рубашку запачкал!',
]
const aliveText = [
    'Ну что ж, поздравляю, ты выжил. Навести родных и близких.',
    'К сожалению, смерть обошла тебя стороной.',
    'Ты не умер, но все равно остался чмохой.',
    'К сожалению, такой паразит, как ты, еще будет существовать.',
    'Всё-таки не сдох, но в штанах появился подарок.',
    'Вытри слезы, жалкое зрелище, ты все еще дышишь.',
    'Только наше время потратил, наслаждайся своим существованием.',
    'Вся жизнь пронеслась у тебя перед глазами, но ты остался жив.',
    'Тело выжило, но ты все так же мертв внутри.',
    'Ты все еще тут, как и твои проблемы.',
    'Пуля осталась в револьвере, а ты остался никем.',
    'Ты жалок, но всё же выжил.',
    'Ты выжил, сходи покорми Дору.',
    'Медленно падает на колени и роняет револьвер из рук, его гнилая жизнь продолжается.',
    'Испускает вздох облегчения, ему суждено жить дальше.',
    'Нажимая на спусковой крючок жаждет смерти, однако его надеждам не суждено сбыться.',
    'Истерично смеётся бросая не выстреливший револьвер на землю.',
    'Лишается возможности покинуть этот мир.',
    'Ещё некоторое время будет отравлять воздух своим присутствием.',
    'После металлического звука продолжает тяжело дышать.',
    'Радуйся, твоё омерзительное существование продолжается.',
    'Очень жаль, но ты выжил.',
    'Ух, а ведь почти!',
    'Мда уж, кто там следующий?',
    'Ну, раз ты остаёшься с нами, можешь вынести следующий труп?',
]

bot.login(config.token);