function displayTranscript() {
  const transcriptInput = document.getElementById('transcriptInput').value;
  const outputDiv = document.getElementById('transcriptOutput');
  const downloadBtn = document.getElementById('downloadBtn');

  if (!transcriptInput.trim()) {
    outputDiv.innerHTML = 'Error: Please paste a transcript.';
    downloadBtn.style.display = 'none';
    return;
  }

  outputDiv.innerHTML = `<pre>${transcriptInput}</pre>`;
  downloadBtn.style.display = 'block';
  downloadBtn.dataset.transcript = transcriptInput;
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
