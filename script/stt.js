const fs = require('fs');
const http = require('http-https')
const request = require('request')
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

const speechToText = new SpeechToTextV1({
  iam_apikey: 'xasydygb0RJ4rThfN_O4Tngfp9vbXUc1f_1zhEHUSt8e',
});

exports.post = function (req, res) {

  var fileName = "audio.ogg";

  options = {
    url: req.body.url
  };

  var req = request(options)
  req.on('data', function (res) {

    fs.writeFileSync(fileName, res)

  })

  const recognizeParams = {
    model: 'pt-BR_NarrowbandModel',

    audio: fs.createReadStream(fileName),
    content_type: 'audio/ogg'/*,
        word_alternatives_threshold: 0.9,
        keywords: ['colorado', 'tornado', 'tornadoes'],
        keywords_threshold: 0.5,*/
  };

  speechToText.recognize(recognizeParams)
    .then(speechRecognitionResults => {
      //console.log(JSON.stringify(speechRecognitionResults, null, 2));
      res.send(JSON.stringify(speechRecognitionResults, null, 2))
    })
    .catch(err => {
      console.log('error:', err);
    });

};
