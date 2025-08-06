YouTube Transcript Extractor
A web application to extract transcripts from YouTube videos and download them as .txt files.
Setup

Import this repository into a browser-based IDE like Replit:
Go to Replit and sign in.
Click "Create Repl" > "Import from GitHub" and enter https://github.com/Oscar200442/youtube-transcript-site1.


Run the app in Replit:
Click the "Run" button to install dependencies and start the server.
Open the preview URL (e.g., https://<repl-id>.replit.app).


Alternatively, deploy to a platform like Vercel by importing the repository.

Usage

Enter a YouTube video URL (e.g., https://www.youtube.com/watch?v=videoId).
Click "Get Transcript" to fetch and display the transcript.
Click "Download as .txt" to save the transcript as a text file.

Notes

Uses the youtube-transcript Node.js package to fetch transcripts.
Not all videos have transcripts available. Ensure the video has auto-generated or manually uploaded transcripts.
For development, test with videos that have the "Show transcript" option enabled.
