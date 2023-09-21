const videoService = require('../services/videoService')

module.exports = {
    trimVideoAndUploadOnYoutube: async (req, res) => {
        const activity = 'trim video and upload'
        try{
            const {s3Key, googleCode, title, description, tag} = req.body || {}
            if(!googleCode){
                console.log(`${activity} | googleCode is required` )
                return res.status(400).send({ status: false, message: "googleCode is required" })
            }
            if(!s3Key){
                console.log(`${activity} | s3Key is required` )
                return res.status(400).send({ status: false, message: "s3Key is required" })
            }
            if(!title){
                console.log(`${activity} | title is required` )
                return res.status(400).send({ status: false, message: "title is required" })
            }
            if(!description){
                console.log(`${activity} | description is required` )
                return res.status(400).send({ status: false, message: "description is required" })
            }
            if(!tag){
                console.log(`${activity} | tag is required` )
                return res.status(400).send({ status: false, message: "tag is required" })
            }
            const {status, code, data, message} = await videoService.trimVideoAndUploadOnYoutube(req.body)
            return res.status(code).send({status, ...(data && {data}), ...(message && {message})})
        }catch(error){
            console.error(`${activity} Error while trimming or uploading video on youtube : `, error.message)
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}