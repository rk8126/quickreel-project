# quickreel-project

# Stackoverflow link 
https://stackoverflow.com/questions/25803937/video-upload-using-youtube-google-api-directly-from-server-using-node-js

# Note
    Please add the env variables

# Functionality
    1. First of all We have to run the server.
    2. Go to the browser and run http://localhost:3000.
    3. You have to sign in with google.
    4. Enter the correct s3Key, title, description and tag.
    5. To Upload the video on Youtube click upload button

# API Endpoint: /video/trim-and-upload
    Functionality:
    HTTP Method: POST

    Input Parameters:
        s3Key (String): The key of the video file in the AWS S3 public bucket that you want to process.
        googleCode (String): The key you will get after singing with google
        title (String): The key of the title to upload video on youtube
        description (String): The key of the description to upload video on youtube
        tag (String): The key of the tag to upload video on youtube
    Output:
        Upon successful processing and upload to YouTube, return a success message.
        In case of errors, return an error message with an appropriate HTTP status code.

    Steps:
        Validate Input: Ensure that the s3Key, googleCode, title, description and tag  parameter is provided in the request.

        Download Video from AWS S3:
            Use the AWS SDK (e.g., AWS SDK for Node.js) to download the video file from the provided S3 public bucket based on the s3Key.
            Handle errors that may occur during the download process, such as S3 download failure.

        Get Video Duration:
            Use FFmpeg or a similar package to get the duration of the downloaded video.
            Calculate the duration of the trimmed video (half of the original duration).

        Trim the Video:
            Use FFmpeg or a similar package to trim the downloaded video to half its original length.
            Create a trimmed video file as the output.
            Handle any errors that may occur during the trimming process, such as FFmpeg errors.

        Upload to YouTube:
            Set video metadata such as title, description, and privacy status.
            Handle YouTube API errors that may occur during the upload.

    Return Response:
        If the entire process is successful, return a success message (e.g., "Trimmed video uploaded successfully on youtube").
        If any errors occur at any step, return an error message with an appropriate HTTP status code (e.g., 400 Bad Request or 500 Internal Server Error).