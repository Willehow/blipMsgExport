const fs = require('fs');
const request = require('request')
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

const speechToText = new SpeechToTextV1({
  iam_apikey: 'xasydygb0RJ4rThfN_O4Tngfp9vbXUc1f_1zhEHUSt8e',
});


exports.post = function (req, res) {

  var audioFile = fs.createWriteStream('audio.ogg');
  var url = req.body.url;
  request(url)
    .pipe(audioFile)
    .on('finish', function(){
      const recognizeParams = {
        model: 'pt-BR_NarrowbandModel',
        //audio: fs.createReadStream('C:\\Users\\f1648\\Downloads\\d1ba1905-bd12-4cc1-b262-d01c939bab38.oga'),
        //audio: file,
        audio: fs.createReadStream('audio.ogg'),
        content_type: 'audio/ogg'/*,
          word_alternatives_threshold: 0.9,
          keywords: ['colorado', 'tornado', 'tornadoes'],
          keywords_threshold: 0.5,*/
      };
  
      speechToText.recognize(recognizeParams)
        .then(speechRecognitionResults => {
          console.log(JSON.stringify(speechRecognitionResults, null, 2));
          res.send(JSON.stringify(speechRecognitionResults, null, 2))
        })
        .catch(err => {
          console.log('error:', err);
        });
    })
};
