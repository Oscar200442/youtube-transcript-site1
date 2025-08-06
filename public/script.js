async function fetchTranscript() {
  const url = document.getElementById('youtubeUrl').value;
  const outputDiv = document.getElementById('transcriptOutput');
  const downloadBtn = document.getElementById('downloadBtn');

  outputDiv.innerHTML = 'Fetching transcript...';
  downloadBtn.style.display = 'none';

  try {
    console.log('Sending request with URL:', url); // Debug
    const response = await fetch('/get-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    console.log('Server response:', data); // Debug

    if (data.error) {
      outputDiv.innerHTML = `Error: ${data.error}`;
      return;
    }

    outputDiv.innerHTML = `<pre>${data.transcript}</pre>`;
    downloadBtn.style.display = 'block';
    downloadBtn.dataset.transcript = data.transcript;
  } catch (error) {
    console.error('Client-side error:', error); // Debug
    outputDiv.innerHTML = 'Error: Failed to fetch transcript.';
  }
}
