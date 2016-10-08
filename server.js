var firebase = require('firebase')
var request = require('request')

var API_KEY = 'AIzaSyBJkzp8E5ER-6GYnRKCz0JSdxf1jqUL2ac'

firebase.initializeApp({
  serviceAccount: require('./credentials/serviceAccountCredentials.json'),
  databaseURL: 'https://guesswut-324e8.firebaseio.com'
})

var ref = firebase.database().ref()

function listenForNotificationRequests () {
  var requests = ref.child('notificationRequests')
  requests.on('child_added', function (requestSnapshot) {
    var request = requestSnapshot.val()
    sendNotificationToUser(
      request.token,
      request.message,
      function () {
        request.ref().remove()
      }
    )
  }, function (error) {
    console.error(error)
  })
}

function sendNotificationToUser (token, message, onSuccess) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=' + API_KEY
    },
    body: JSON.stringify({
      notification: {
        title: message
      },
      to: token
    })
  }, function (error, response, body) {
    if (error) {
      console.error(error)
    } else if (response.statusCode >= 400) {
      console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage)
    } else {
      onSuccess()
    }
  })
}

listenForNotificationRequests()
