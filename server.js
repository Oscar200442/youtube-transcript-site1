const express = require('express');
const { YoutubeTranscript } = require('youtube-transcript');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/get-transcript', async (req, res) => {
  const { url } = req.body;
  try {
    const videoId = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(segment => segment.text).join(' ');

    res.json({ transcript: transcriptText });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ error: 'Failed to fetch transcript. Ensure the video has transcripts enabled.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
