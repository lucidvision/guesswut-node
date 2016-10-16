var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

var API_KEY = 'AIzaSyBJkzp8E5ER-6GYnRKCz0JSdxf1jqUL2ac'

var port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' })
})

app.post('/sendNotification', function (req, res) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=' + API_KEY
    },
    body: JSON.stringify({
      registration_ids: req.body.tokens,
      notification: {
        title: req.body.title,
        body: req.body.body,
        sound: true,
        vibrate: true
      }
    })
  }, function (error, response, body) {
    if (error) {
      console.error('Error')
      res.json({ message: error })
    } else if (response.statusCode >= 400) {
      console.error('Error')
      res.json({ message: `Error: + ${response.statusCode} - ${response.statusMessage}` })
    } else {
      console.log('success')
      res.json({ message: 'Notifications sent!' })
    }
  })
})

app.listen(port, function () {
  console.log('Magic happens on port ' + port)
})
