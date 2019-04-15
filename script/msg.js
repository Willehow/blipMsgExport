var json2csv = require('json2csv').parse;
 
exports.get = function(req, res) {

    var fields = [
        'login',
        'nome',
        'email',
        'msg',
        'data'
    ]

    var request = require('request');

    var jsonBlip = {  
        "id": "1",
        "method": "get",
        "uri": "/threads?$take=300"
    }

    //Lets configure and request
    request({
        url: 'https://msging.net/commands', //URL to hit
        method: 'POST', // specify the request type
        headers: { // speciyfy the headers
            'Content-Type': 'application/json',
            'Authorization': 'Key cmgyOnJ4SmU1MktKbnRjWDhRRWRhQmdH'
        },
        body: JSON.stringify(jsonBlip) //Set the body as a string
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);

            var users = JSON.parse(body)

            console.log(users["from"])

            /*
            for(var i = 0; i<=users){

            }
            */

        }
    });

    var json = [
        
        {
        'login': 'f1648',
        'nome': 'teste',
        'email': 'teste@teste.com',
        'msg': 'testando essa mensagem',
        'data': '2019-04-12'
        }
    ]

    var opt = { fields, delimiter: ';', quote: ""}
 
    var csv = json2csv(json, opt);
 
    res.set("Content-Disposition", "attachment;filename=blipmsg.csv");
    res.set("Content-Type", "application/octet-stream");
 
    res.send(csv);
 
};
