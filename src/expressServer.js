const { oauth2Client } = require('./server');

const app = require('./server').app


var auth = false

app.get('/', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile'
    });
    res.render('login', {url})
});
app.get('/google/callback', (req, res) => {
    const code = req.query.code
    res.render('uploadS3key', {code})
});
app.use('/video', require('./app/routes/videoRoute'))

module.exports.app = app