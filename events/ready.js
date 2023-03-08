const { Events, ActivityType } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity('the dynmap', { type: ActivityType.Watching});
		client.user.setStatus('online');
	},
};