const express = require('express')
const router = express.Router()

const videoController = require('../controllers/videoController')

router.post('/trim-and-upload', videoController.trimVideoAndUploadOnYoutube)

module.exports = router