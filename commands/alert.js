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

        let requiredNation = town.nation

        const residents = JSON.stringify(town.residents);
        const x = town.x;
        const z = town.z;

        setInterval(async function() {

        const nearbyPlayers = await ccnet.getNearbyPlayers(x, z, xradius, zradius).then(players => { return players });

        const nonResidents = nearbyPlayers.filter(player => !residents.includes(player.name));

        let modifiedPlayerData = nearbyPlayers.filter((item) => { return item.nation.toLowerCase() !== requiredNation.toLowerCase() })

        var playerDistancesdata = modifiedPlayerData.map((item) => {
          return Math.sqrt((x - item.x) ** 2 + (z - item.z) ** 2);
        });
        var newPlayerData = modifiedPlayerData.map((item, index) => {
          return { ...item, distance: playerDistancesdata[index] };
        });
        console.log(playerDistancesdata, newPlayerData);

        let distance = Math.min( ...playerDistancesdata)

        let alertcolor = ''
        let alertlevel = ''
      if (distance <= 75) {
        alertcolor = 'FF0000'; alertlevel = 'RED'
    } else if (distance <= 150) {
        alertcolor = 'FFA500'; alertlevel = 'ORANGE'
    } else if (distance <= 300) {
        alertcolor = 'FFFF00'; alertlevel = 'YELLOW'
    }

       if (newPlayerData.length === 0) return interaction.editReply(`There are no non-residents nearby!`);

    if (alertlevel === 'RED') {
        alertEmbed.setTitle(`Red Alert for ${townName}!`)
        .setDescription(`There are ${newPlayerData.length} non-residents within 75 blocks! \n ${newPlayerData.map(player => player.name).join(', ')}`)
        .setColor(alertcolor)
    } else if (alertlevel === 'ORANGE') {
        alertEmbed.setTitle(`Orange Alert for ${townName}!`)
        .setDescription(`There are ${newPlayerData.length} non-residents within 150 blocks! \n ${newPlayerData.map(player => player.name).join(', ')}`)
        .setColor(alertcolor)
    } else if (alertlevel === 'YELLOW') {
        alertEmbed.setTitle(`Yellow Alert for ${townName}!`)
        .setDescription(`There are ${newPlayerData.length} non-residents within 300 blocks! \n ${newPlayerData.map(player => player.name).join(', ')}`)
        .setColor(alertcolor)
    }

       console.log(alertcolor,alertlevel)
        await interaction.editReply({ embeds: [alertEmbed] });
       // alertEmbed.setDescription(null).setColor(null).setTitle(null);
    }, 15000);

    }
}