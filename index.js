//Initial Setups
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
require("dotenv").config();
var set = false

bot.commands = new Discord.Collection();
//Command Handler Init
fs.readdir("./Commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f,i) =>{
    let props = require(`./Commands/${f}`)
    console.log(`${f} loaded!`)
    bot.commands.set(props.help.name, props)
  });

});
//Listener for message.
bot.on('message', message =>{
    //Variables
    const prefix = ';';
    let msg = message.content.toUpperCase();
    let sender = message.author;
    const server = message.guild
    if (sender.bot) return;
    if (!message.content.startsWith(prefix)) return;    
    let args = msg.slice(prefix.length).trim().split(" ");
    let cmd = args.shift().toLowerCase();
    var x = 0
    var z = 0
    let color = 0
    let commandfile = bot.commands.get(cmd.slice(prefix));
    if(commandfile) commandfile.run(bot,message,args);
});

//Listener for bot start.
bot.on('ready', () => {
    console.log('Bot Running.')
    async function run(){
      let commandfile = bot.commands.get('alert')
      if(commandfile) commandfile.run(bot)
    }
    async function towns(){
      let commandfile = bot.commands.get('town')
      if(commandfile) commandfile.run('Auto')
    }
    run();
    towns();
    setInterval(run, 59*1000);
    setInterval(towns, 3000)
});
//Login Bot
bot.login(process.env.BOT_TOKEN);
