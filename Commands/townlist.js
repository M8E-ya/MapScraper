const request = require("request");
const fs = require('fs');
const dataFile = './data.json';

module.exports.run = async (message, args) => {
    request("https://map.ccnetmc.com/nationsmap/standalone/dynmap_world.json", async function(error, response, body) {
        const data = JSON.parse(body);
        const updates = data.updates.filter(update => update.msg === 'markerupdated');
        const towns = updates.filter(update => update.desc.includes('Town'));
        const nationTowns = towns.filter(town => town.desc.includes('Teutonic_Order'));

        let jsonData = {
            lastUpdate: new Date().toISOString(),
            towns: []
        };

        nationTowns.forEach(town => {
            let desc = town.desc;
            let name = desc.split('>')[4].split(') ')[1];
            let mayor = desc.split('>')[14].replace(/&#xA;/g, '\n').replace('Mayor: ', '');
            let members = desc.split('>')[18].replace(/&#xA;/g, '\n').replace('Residents: ', '');
            let coords = `${town.x},${town.z}`;

            let townData = {
                name: name,
                mayor: mayor,
                members: members,
                coords: coords
            };
            console.log(townData)
            jsonData.towns.push(townData);
        });

        fs.writeFile(dataFile, JSON.stringify(jsonData, null, 4), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`Data written to ${dataFile}`);
        });
    });
};

module.exports.help = {
    name: "town"
};
