const CLIENT_ID = '648045152886-nj5ppll4u2k0pp0ql7lm4904mg1bl4v4.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

function signIn() {
  try {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        client_id: CLIENT_ID,
        scope: SCOPES,
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signIn().then(() => {
          document.getElementById('signInButton').style.display = 'none';
          document.getElementById('inputSection').style.display = 'block';
        }).catch(error => {
          document.getElementById('error').textContent = `Sign-in failed: ${error.error || error.message || 'Unknown error'}`;
          document.getElementById('error').style.display = 'block';
          console.error('Sign-in error:', error);
        });
      }).catch(error => {
        document.getElementById('error').textContent = `Failed to initialize auth: ${error.error || error.message || 'Unknown error'}`;
        document.getElementById('error').style.display = 'block';
        console.error('Auth initialization error:', error);
      });
    });
  } catch (error) {
    document.getElementById('error').textContent = `Error loading Google API Client: ${error.message}`;
    document.getElementById('error').style.display = 'block';
    console.error('Google API Client load error:', error);
  }
}

async function downloadTranscripts() {
  const youtubeLinks = document.getElementById('youtubeLinks').value.split(',').map(url => url.trim());
  const transcriptOutput = document.getElementById('transcriptOutput');
  const downloadLink = document.getElementById('downloadLink');
  const errorDiv = document.getElementById('error');
  const loadingDiv = document.getElementById('loading');

  // Reset outputs
  transcriptOutput.value = '';
  if (downloadLink.href) {
    URL.revokeObjectURL(downloadLink.href); // Prevent memory leaks
  }
  downloadLink.style.display = 'none';
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';
  loadingDiv.style.display = 'block';

  // Validate YouTube URLs
  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=?\s]{11})/;
    return regex.test(url);
  };

  if (!youtubeLinks || youtubeLinks[0] === '') {
    errorDiv.textContent = 'Please enter at least one YouTube URL.';
    errorDiv.style.display = 'block';
    loadingDiv.style.display = 'none';
    return;
  }

  if (!youtubeLinks.every(isValidYouTubeUrl)) {
    errorDiv.textContent = 'One or more URLs are not valid YouTube URLs.';
    errorDiv.style.display = 'block';
    loadingDiv.style.display = 'none';
    return;
  }

  try {
    // Check if user is signed in
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance || !authInstance.isSignedIn.get()) {
      errorDiv.textContent = 'Please sign in with Google to access transcripts.';
      errorDiv.style.display = 'block';
      loadingDiv.style.display = 'none';
      document.getElementById('signInButton').style.display = 'block';
      document.getElementById('inputSection').style.display = 'none';
      return;
    }

    // Load YouTube API v3
    await new Promise((resolve, reject) => {
      if (typeof gapi === 'undefined') {
        reject(new Error('Google API Client Library failed to load. Check network or script inclusion.'));
      }
      gapi.load('client', {
        callback: () => {
          gapi.client.load('youtube', 'v3').then(resolve).catch(reject);
        },
        onerror: () => reject(new Error('Failed to load gapi.client')),
      });
    });

    // Verify YouTube API is loaded
    if (!gapi.client.youtube || !gapi.client.youtube.captions) {
      throw new Error('Failed to load YouTube API v3. Ensure YouTube Data API v3 is enabled.');
    }

    const transcripts = {};
    for (const url of youtubeLinks) {
      const videoId = url.match(/(?:v=)([^&=?\s]{11})/)?.[1];
      if (!videoId) {
        transcripts[url] = 'Invalid YouTube URL';
        continue;
      }

      try {
        // List available captions
        const captionResponse = await gapi.client.youtube.captions.list({
          part: 'snippet',
          videoId: videoId,
        });

        const captionItems = captionResponse.result.items;
        if (!captionItems || captionItems.length === 0) {
          transcripts[url] = 'No captions available for this video.';
          continue;
        }

        // Get the first available caption track (preferring 'en' language)
        const captionTrack = captionItems.find(item => item.snippet.language === 'en') || captionItems[0];
        const captionId = captionTrack.id;

        // Download captions in SRT format
        const downloadResponse = await gapi.client.youtube.captions.download({
          id: captionId,
          tfmt: 'srt',
        });

        transcripts[url] = downloadResponse.result || 'No transcript content retrieved.';
      } catch (error) {
        const errorMessage = error.result?.error?.message || error.message || 'Unknown error occurred.';
        transcripts[url] = `Error: ${errorMessage}`;
      }
    }

    let allTranscripts = '';
    for (const [url, transcript] of Object.entries(transcripts)) {
      allTranscripts += `Transcript for ${url}:\n${transcript}\n\n`;
    }

    if (!allTranscripts.trim()) {
      errorDiv.textContent = 'No transcripts were retrieved for the provided URLs.';
      errorDiv.style.display = 'block';
      transcriptOutput.value = '';
      loadingDiv.style.display = 'none';
      return;
    }

    transcriptOutput.value = allTranscripts;

    // Create downloadable .txt file
    const blob = new Blob([allTranscripts], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'transcripts.txt';
    downloadLink.style.display = 'block';
    loadingDiv.style.display = 'none';
  } catch (error) {
    errorDiv.textContent = `Error fetching transcripts: ${error.message}`;
    errorDiv.style.display = 'block';
    transcriptOutput.value = '';
    loadingDiv.style.display = 'none';
    console.error('Detailed error:', error);
  }
}

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signInButton').style.display = 'block';
  document.getElementById('inputSection').style.display = 'none';
});
