var json2csv = require('json2csv').parse;
var request = require('request');
 
exports.get = function(req, res) {

    var fields = [
        "Usuário",
        "Nome",
        "Tipo",
        "Conteúdo",
        "Estado",
        "Data",
        "Email",
        "IP"
    ]

    function buildCSV(json){

        var opt = { fields, delimiter: ';', quote: "", withBOM: true}

        var csv = json2csv(json, opt);

        res.set("Content-Disposition", "attachment;filename=blipmsg.csv");
        res.set("Content-Type", "application/octet-stream");

        res.send(csv);
    }

    async function getThreads(){

        var jsonBlip = {  
            "id": generateUUID(),
            "method": "get",
            "uri": "/threads?$take=3"
        }

        //Lets configure and request
        return new Promise((resolve, reject) => { 
            request({
                url: 'https://msging.net/commands', //URL to hit
                method: 'POST', // specify the request type
                headers: { // speciyfy the headers
                    'Content-Type': 'application/json',
                    'Authorization': 'Key cmgyOnJ4SmU1MktKbnRjWDhRRWRhQmdH'
                },
                body: JSON.stringify(jsonBlip) //Set the body as a string
            }, function(error, response, body){
                if(error || response.statusCode != 200) {
                    //console.log(error);
                    res.send("Erro "+response.statusCode+": "+response.statusMessage);
                } else {
                    //console.log(response.statusCode);

                    var users = JSON.parse(body)

                    //console.log(users["resource"]["items"].length)
                    
                    let userIds = new Array();

                    for(let user of users["resource"]["items"]){

                        userIds.push(user.identity)
                        
                    }

                    resolve(userIds);
                    
                }
            });
        });
    }

    async function getContact(userId){

        var jsonBlip = {  
            "id": generateUUID(),
            "method": "get",
            "uri": "/contacts/"+userId
        }

        //Lets configure and request
        return new Promise((resolve, reject) => { 
            request({
                url: 'https://msging.net/commands', //URL to hit
                method: 'POST', // specify the request type
                headers: { // speciyfy the headers
                    'Content-Type': 'application/json',
                    'Authorization': 'Key cmgyOnJ4SmU1MktKbnRjWDhRRWRhQmdH'
                },
                body: JSON.stringify(jsonBlip) //Set the body as a string
            }, function(error, response, body){
                if(error || response.statusCode != 200) {
                    //console.log(error);
                    res.send("Erro "+response.statusCode+": "+response.statusMessage);
                } else {

                    //console.log(response.statusCode);

                    var contactInfo = JSON.parse(body)

                    let contact = [

                        {
                            "nome": contactInfo["resource"]["name"],
                            "email": contactInfo["resource"]["email"],
                            "ip": contactInfo["resource"]["address"]
                        }
                    ]

                    resolve(contact);
                    
                }
            });
        });
    }

    async function getMsg(userId, contact){

        var jsonBlip2 = {  
            "id": generateUUID(),
            "method": "get",
            "uri": "/threads/"+userId
        }

        //Lets configure and request
        return new Promise((resolve, reject) => { 
            request({
                url: 'https://msging.net/commands', //URL to hit
                method: 'POST', // specify the request type
                headers: { // speciyfy the headers
                    'Content-Type': 'application/json',
                    'Authorization': 'Key cmgyOnJ4SmU1MktKbnRjWDhRRWRhQmdH'
                },
                body: JSON.stringify(jsonBlip2) //Set the body as a string
            }, function(error, response, body){
                if(error || response.statusCode != 200) {
                    //console.log(error);
                    res.send("Erro "+response.statusCode+": "+response.statusMessage);
                } else {

                    //console.log(response.statusCode);

                    var msgs = JSON.parse(body)

                    //console.log(msgs)

                    let jsonMsg = new Array();

                    for(let msg of msgs["resource"]["items"]){

                        let data = new Date(msg.date).toISOString().slice(0, 10) + " " + new Date(msg.date).toTimeString().slice(0, 8)

                        if(msg.direction == "sent"){

                            jsonMsg.push(

                                {
                                    "Usuário":userId,
                                    "Nome": "Maris",
                                    "Tipo": msg.type,
                                    "Conteúdo": msg.content,
                                    "Estado": msg.metadata["#stateName"],
                                    "Data": data,
                                    "Email": contact[0].email,
                                    "IP": contact[0].ip
                                }
                            )

                        } else {

                            jsonMsg.push(

                                {
                                    "Usuário":userId,
                                    "Nome": contact[0].nome,
                                    "Tipo": msg.type,
                                    "Conteúdo": msg.content,
                                    "Estado": "N/A",
                                    "Data": data,
                                    "Email": contact[0].email,
                                    "IP": contact[0].ip
                                }
                            )
                        }
                    }

                    resolve(jsonMsg);

                }
            });
        });
    }

    async function main(){

        let userIds = await getThreads()

        let jsonFinal = new Array();

        for(let userId of userIds){

            let contact = await getContact(userId)
            let msgs = await getMsg(userId, contact)
            
            //Unifica as mensagens de todos os usuários
            for(let msg of msgs){

                jsonFinal.push(msg)

            }
        }

        buildCSV(jsonFinal)
    }

    function generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    main();
};
