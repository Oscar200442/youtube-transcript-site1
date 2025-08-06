async function fetchTranscript() {
  const url = document.getElementById('youtubeUrl').value;
  const outputDiv = document.getElementById('transcriptOutput');
  const downloadBtn = document.getElementById('downloadBtn');

  outputDiv.innerHTML = 'Fetching transcript...';
  downloadBtn.style.display = 'none';

  try {
    const response = await fetch('/get-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json();

    if (data.error) {
      outputDiv.innerHTML = `Error: ${data.error}`;
      return;
    }

    outputDiv.innerHTML = `<pre>${data.transcript}</pre>`;
    downloadBtn.style.display = 'block';
    downloadBtn.dataset.transcript = data.transcript;
  } catch (error) {
    outputDiv.innerHTML = 'Error: Failed to fetch transcript.';
  }
}

function downloadTranscript() {
  const transcript = document.getElementById('downloadBtn').dataset.transcript;
  const blob = new Blob([transcript], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transcript.txt';
  a.click();
  URL.revokeObjectURL(url);
}
