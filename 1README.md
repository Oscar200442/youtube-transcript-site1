YouTube Transcript Extractor
A static web application hosted on GitHub Pages to display and download YouTube video transcripts.
Setup

Add the files (index.html, styles.css, script.js) to the youtube-transcript-site1 repository via GitHub’s web interface.
Enable GitHub Pages in the repository settings (select the main branch as the source).
Access the site at https://oscar200442.github.io/youtube-transcript-site1.

Usage

Copy a transcript from a YouTube video (open the video, click “Show more,” then “Show transcript,” and copy the text).
Paste the transcript into the text area.
Click “Display Transcript” to show it in a box.
Click “Download as .txt” to save it as a text file.

Notes

This is a static site hosted on GitHub Pages, so it cannot fetch transcripts directly from YouTube.
Users must manually copy and paste the transcript from YouTube.
For dynamic transcript fetching, a backend server (e.g., Node.js with youtube-transcript) is required, which GitHub Pages does not support.
