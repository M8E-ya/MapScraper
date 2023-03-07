const request = require("request");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let z = 0
    let sender = message.author;
    request("https://map.ccnetmc.com/nationsmap/standalone/dynmap_world.json", (error, response, body) => {
        const data = JSON.parse(body);
        let arr = data.players
        for(var i in arr){
            z++;
            if ((arr[i].account.toUpperCase()) == args[0]){
                sender.send(`X Coordinate: ${arr[i].x}\nY Coordinate: ${arr[i].y}\nZ Coordinate: ${arr[i].z}`)
                console.log(arr[i].account.toUpperCase())
                return;
            }
            else if(z == arr.length){
                sender.send(`Player not found! :cry:`)
                return;
            }

        }

    })
}
module.exports.help = {
    name: "lookup"
}
