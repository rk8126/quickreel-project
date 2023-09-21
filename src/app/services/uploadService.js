const fs = require('fs');
const { google } = require('googleapis');

const videoFilePath = 'output.mp4';
const { oauth2Client } = require('../../server');

exports.uploadVideo = (title, description, tags, code) => {
  oauth2Client.getToken(code, function (err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    oauth2Client.credentials = token;
    const service = google.youtube('v3')
    service.videos.insert({
      auth: oauth2Client,
      part: 'snippet,status',
      resource: {
        snippet: {
          title,
          description,
          tags
        },
        status: {
          privacyStatus: "private"
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    }, function (err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      console.log("Video uploaded successfully", response?.data)
      fs.unlink(videoFilePath, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
        } else {
          console.log('File deleted successfully.');
        }
      });
    });
  });
}
