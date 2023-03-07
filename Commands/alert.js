  
const request = require("request");
const Discord = require("discord.js");
const Trello = require('trello');
const trello = new Trello(process.env.TKEY_1,process.env.TKEY_2);
const board = 'bxSa35fP';
const strip = require('striptags');

module.exports.run = async (bot, message, args) => {

    let page = 0;
    let alertchannel = bot.channels.get('879436584921989121')
    let severity = 'Green'
    let distarr = []

  /*  for(var x in lists){
        p++;
        let cards = await trello.getCardsOnList(lists[x]['id']).then((cards2) => {
            console.log(cards2)
            let coord = cards2[0]['desc']
            hbs.push(coord)
            if(p === lists.length){
                return hbs;
            }
        })
    }
    for(var x in lists){
        p++;
        let cards = await trello.getCardsOnList(lists[x]['id']).then((cards2) => {
            let people = cards2[1]['desc'].split(',')
            for(var p in people){
                mlts.push(people[p])
            }
            if(p === lists.length){
                return mlts;
            }
        })
    }*/

    request("https://map.ccnetmc.com/nationsmap/standalone/dynmap_world.json", (error, response, body) => {
        var z = 0
        const data = JSON.parse(body);
        let arr = data.players
       // console.log(arr)
        for(var i in arr){
                let account = arr[i].account
                let x1 = arr[i].x
                let z1 = arr[i].z
                let x2 = parseInt(process.env.XCORD)
                let z2 = parseInt(process.env.ZCORD)
                let dist = Math.sqrt((x1-x2) ** 2 + (z1-z2) ** 2)
                if((dist <= 300) && (!JSON.parse(process.env.PLAYERS.includes(account)))){
                    let w = 0;
                    dist = Math.round(dist)
                    if (dist <=75 && severity === 'Green'){
                        severity = 'Red'
                    }
                    else if (dist <=150 && severity === 'Green'){
                        severity = 'Orange'
                    }
                    else if (dist <=300 && severity === 'Green'){
                        severity = 'Yellow'
                    }
                    distarr.push([account,dist,z])
            }
        }
        if(distarr.length >= 1){
            if (severity == 'Red'){
                alertchannel.send(`-=-=-= Severity: Red =-=-=-\n<@&675909681931354139>`)
                send()
            }
            else if(severity == 'Orange'){
                alertchannel.send(`-=-=-= Severity: Orange =-=-=-`)
                send()
            }
            else if(severity == 'Yellow'){
                alertchannel.send(`-=-=-= Severity: Yellow =-=-=-`)
                send()
            }
            //Embed and Other
            function send(){
                const peoples = new Discord.RichEmbed({
                    "title": "Report of Players",
                    "description": "-----------------------------------------------------------",
                    "url": "",
                    "color": 5301186,
                    "footer": {
                        "icon_url": "https://pbs.twimg.com/media/CmOsJDmWEAAHW2b.jpg",
                        "text": "Click the right arrow to view players!"
                    },
                    "thumbnail": {
                    "url": "https://pbs.twimg.com/media/CmOsJDmWEAAHW2b.jpg"
                    },
                });
            
                function newEmbed(num, msg) {
                    let emtown = ts[distarr[num-1][3]]
                    var people = new Discord.RichEmbed()
                    .setTitle('List of People')
                    .setFooter('Page '.concat(num, ' of ', distarr.length))
                    .setDescription('-----------------------------------------------------------')
                    .setColor(5301186)
                    .setThumbnail("https://pbs.twimg.com/media/CmOsJDmWEAAHW2b.jpg")
                    .addField('Name:', distarr[num-1][0], true)
                    .addField('Nickname:', distarr[num-1][1], true)
                    .addField('Distance:', distarr[num-1][2], true)
                    .addField('Town:', emtown, true)
                    msg.message.edit({embed: people})
                }
                alertchannel.send({embed: peoples}).then(async msg => {
                    
                    await msg.react("⬅");
                    await msg.react("➡");
            
                    const pageupFilter = (reaction, user) => reaction.emoji.name === "➡" && !user.bot;
                    const pagedownFilter = (reaction, user) => reaction.emoji.name === "⬅" && !user.bot;
            
                    const pageup = msg.createReactionCollector(pageupFilter, {time : 59*1000});
                    const pagedown = msg.createReactionCollector(pagedownFilter, {time : 59*1000});
                    pageup.on('collect', r => {
                        if (page === distarr.length) return;
                        page++;
                        newEmbed(page, r)
                        
                    });
            
                    pagedown.on('collect', r => {
                        if (page === 1) return;
                        page--;
                        newEmbed(page, r)
                    });
                    
                });
            }
        }
    });

}

module.exports.help = {
    name: "alert"
}