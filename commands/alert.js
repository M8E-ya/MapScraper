const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ccnet = require("ccnetmc");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alert')
        .setDescription('Sends an embed alert to a specified channel, when someone enters a town.')
        .addStringOption(option =>
            option.setName('town')
                .setDescription('The town to alert for.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('xradius')
                .setDescription('The x radius to search for players in.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('zradius')
                .setDescription('The z radius to search for players in.')
                .setRequired(true)),

    async execute(interaction) {

        const alertEmbed = new EmbedBuilder()
        
        await interaction.deferReply();

        const townName = interaction.options.getString('town').replaceAll(' ', '_');
        const xradius = interaction.options.getInteger('xradius');
        const zradius = interaction.options.getInteger('zradius');

        await interaction.editReply(`Alert for ${townName} started!`)

        const town = await ccnet.getTown(townName).then(town => { return town });

        const residents = JSON.stringify(town.residents);
        const x = town.x;
        const z = town.z;
        
        setInterval(async function() {     

        const nearbyPlayers = await ccnet.getNearbyPlayers(x, z, xradius, zradius).then(players => { return players });

        const nonResidents = nearbyPlayers.filter(player => !residents.includes(player.name));

        const playerx = nearbyPlayers.x;
        const playerz = nearbyPlayers.z;

        let distance = Math.sqrt((x-playerx) ** 2 + (z-playerz) ** 2);

        console.log(nearbyPlayers)
        console.log(playerx, playerz)

        let level = {}
      if (distance <= 50) {
        level = { color: 'FF0000', alertlevel: 'RED'}
    } else if (distance <= 100) {
        level = { color: 'FFA500', alertlevel: 'ORANGE'} 
    } else if (distance <= 150) { 
        level = {color: 'FFFF00', alertlevel: 'YELLOW'}
    }

        if (nonResidents.length === 0) return interaction.editReply(`There are no non-residents nearby!`);

    if (level.alertlevel === 'RED') {
        alertEmbed.setTitle(`Red Alert for ${townName}!`)
        .setDescription(`There are ${nonResidents.length} non-residents within 50 blocks! \n ${nonResidents.map(player => player.name).join(', ')}`)
        .setColor(level.color)
    } else if (level.alertlevel === 'ORANGE') {
        alertEmbed.setTitle(`Orange Alert for ${townName}!`)
        .setDescription(`There are ${nonResidents.length} non-residents within 100 blocks! \n ${nonResidents.map(player => player.name).join(', ')}`)
        .setColor(level.color)
    } else if (level.alertlevel === 'YELLOW') {
        alertEmbed.setTitle(`Yellow Alert for ${townName}!`)
        .setDescription(`There are ${nonResidents.length} non-residents within 150 blocks! \n ${nonResidents.map(player => player.name).join(', ')}`)
        .setColor(level.color)
    }

        await interaction.editReply({ embeds: [alertEmbed] });
        //alertEmbed.setDescription(null).setColor(null).setTitle(null);
    }, 15000);

    }
}