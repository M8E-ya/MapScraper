const request = require("request");
const Trello = require("trello")
var trello = new Trello(process.env.TKEY_1,process.env.TKEY_2)
var board = 'bxSa35fP';
let running = false
module.exports.run = async (message, args) => {
    if(running == false){
        let part2 = false
        let n = 0
        run()
        async function run(){
            request("https://map.ccnetmc.com/nationsmap/standalone/dynmap_world.json",async function(error, response, body){
                const data = JSON.parse(body);
                let arr = data.updates
                let n = 0
                running = true
                for(var x in arr){
                    n++;
                    if(arr[x].msg === 'markerupdated'){
                        let desc = arr[x].desc
                        let chunks = desc.split('>')
                        let precountry = chunks[4].split(' ')
                        let country = precountry[1].split(')')[0].substr(0,precountry[1].length-5)
                        if(country === 'Teutonic_Order'){
                            let pretown = arr[x].label.split(' ')
                            let town = pretown[0]
                            let mayor = chunks[14].substr(0,chunks[14].length-6)
                            let memchunks = chunks[18].split(', ')
                            let premembers = memchunks.toString()
                            let members = premembers.substr(0,premembers.length-6)
                            let xcoord = arr[x].x
                            let zcoord = arr[x].z
                            let z = 0;
                            let lists = trello.getListsOnBoard(board);
                            lists.then((lists2) =>{
                                for(var i in lists2){
                                    z+=1;
                                    if(lists2[i]['name'] === town){
                                        let cards = trello.getCardsOnList(lists2[i]['id'])
                                        cards.then((cards2) =>{
                                        trello.updateCardDescription(cards2[0]['id'], mayor)
                                        trello.updateCardDescription(cards2[1]['id'], members)
                                        trello.updateCardDescription(cards2[2]['id'], `${xcoord} ${zcoord}`)
                                        })
                                        return;
                                    }
                                    else if(lists2.length+1 === z+1){
                                        trello.addListToBoard(board, town,
                                            async function (error, AddList) {
                                                if (error) {
                                                    console.log('Could not add list:', error);
                                                }
                                                else {
                                                    console.log('Added list');
                                                    await trello.addCard('Mayor', mayor, AddList['id'])
                                                    await trello.addCard('Members', members, AddList['id'])
                                                    await trello.addCard('Homeblock', `${xcoord} ${zcoord}`, AddList['id'])
                                                }
                                            })
                                        return;
                                    }
                                }
                            part2 = true
                            })
                        }
                    }
                    else if (n === arr.length){
                        part2 = true
                    }
                }
                if((arr.length===n) && (part2==true)){
                    running = false
                }
            })
        }
    }
}

module.exports.help = {
    name: "town"
}
