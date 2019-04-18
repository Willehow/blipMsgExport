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

    var users = getThreads();

    for(var i = 0; i < users["resource"]["items"].length;i++){

        console.log(users["resource"]["items"][i].identity)

        var user = users["resource"]["items"][i].identity

        getMsg(user);
        
    }

    buildCSV();


    function buildCSV(){
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
    }

    function getThreads(){

        var jsonBlip = {  
            "id": generateUUID(),
            "method": "get",
            "uri": "/threads?$take=50"
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
                //console.log(response.statusCode, body);

                var users = JSON.parse(body)

                console.log(users["resource"]["items"].length)

                return users;

                /*
                for(var i = 0; i < users["resource"]["items"].length;i++){

                    console.log(users["resource"]["items"][i].identity)

                    var user = users["resource"]["items"][i].identity

                    getMsg(user);
                    
                }
                */
            }
        });
    }

    function getMsg(user){

        var jsonBlip2 = {  
            "id": generateUUID(),
            "method": "get",
            "uri": "/threads/"+user
        }

        //Lets configure and request
        request({
            url: 'https://msging.net/commands', //URL to hit
            method: 'POST', // specify the request type
            headers: { // speciyfy the headers
                'Content-Type': 'application/json',
                'Authorization': 'Key cmgyOnJ4SmU1MktKbnRjWDhRRWRhQmdH'
            },
            body: JSON.stringify(jsonBlip2) //Set the body as a string
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {

                //console.log(response.statusCode, body);

                var msgs = JSON.parse(body)

                console.log(msgs)

        }});
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
};
