const AWS = require('aws-sdk');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath)
const { uploadVideo } = require("../services/uploadService")

AWS.config.update({
  accessKeyId: process.env.AWS_KEYID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

async function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata?.format?.duration);
      }
    });
  });
}

async function getVideoData(s3Key) {
  try{
    const videoData = await s3.getObject({ Bucket: process.env.AWS_BUCKET, Key: s3Key }).promise();
    return {status: true, videoData}
  }catch(error){
    console.log("Error in fetching video details", error)
    return {status: false}
  }
}

module.exports = {
  trimVideoAndUploadOnYoutube: async (body) => {
    const {s3Key, googleCode, title, description, tag} = body || {}

    const {status, videoData} = await getVideoData(s3Key)
    if (!status) {
      return { status, code: 404, message: "video not found" }
    }
    if (videoData.ContentType != "video/mp4") {
      return { status: false, code: 400, message: "video format must be mp4" }
    }

    const inputPath = 'input.mp4';
    fs.writeFileSync(inputPath, videoData.Body);

    const videoDuration = await getVideoDuration(`./${inputPath}`)
    const outputPath = 'output.mp4';
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(0)
        .setDuration(Math.floor(videoDuration) / 2)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .format('mp4')
        .on('end', resolve)
        .on('error', reject)
        .run();
    })
    fs.unlink(inputPath, (err) => {
      if (err) {
        console.error('Error deleting the file:', err);
      } else {
        console.log('File deleted successfully.');
      }
    });
    uploadVideo(title, description, [tag], googleCode)
    return { status: true, code: 200, message: "trimmed video uploaded successfully on youtube" }
  }
}