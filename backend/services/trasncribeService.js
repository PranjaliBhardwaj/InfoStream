const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require('@aws-sdk/client-transcribe');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const https = require('https');

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadAudioToS3(audioBuffer) {
  const bucketName = process.env.AWS_S3_BUCKET;
  const fileName = `transcribe-input-${uuidv4()}.mp3`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: audioBuffer,
    ContentType: 'audio/mpeg',
  });

  await s3Client.send(command);

  return `s3://${bucketName}/${fileName}`;
}

async function speechToText(audioBuffer) {
  try {
    const s3Uri = await uploadAudioToS3(audioBuffer);

    const jobName = `transcribe-job-${uuidv4()}`;

    const startCommand = new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: 'en-US',
      MediaFormat: 'mp3',
      Media: {
        MediaFileUri: s3Uri,
      },
    });

    await transcribeClient.send(startCommand);

    let jobStatus = 'IN_PROGRESS';
    let transcriptText = '';

    while (jobStatus === 'IN_PROGRESS') {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const getCommand = new GetTranscriptionJobCommand({
        TranscriptionJobName: jobName,
      });

      const jobResponse = await transcribeClient.send(getCommand);
      jobStatus = jobResponse.TranscriptionJob.TranscriptionJobStatus;

      if (jobStatus === 'COMPLETED') {
        const transcriptUri = jobResponse.TranscriptionJob.Transcript.TranscriptFileUri;

        transcriptText = await new Promise((resolve, reject) => {
          https.get(transcriptUri, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              const json = JSON.parse(data);
              resolve(json.results.transcripts[0].transcript);
            });
          }).on('error', reject);
        });
      } else if (jobStatus === 'FAILED') {
        throw new Error('Transcription job failed');
      }
    }

    return transcriptText;
  } catch (error) {
    console.error('Transcribe speech-to-text error:', error);
    throw error;
  }
}

module.exports = {
  speechToText,
};
