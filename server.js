const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/get-transcript', async (req, res) => {
  const { url } = req.body;
  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('button[aria-label="Show transcript"]', { timeout: 10000 });
    await page.click('button[aria-label="Show transcript"]');

    await page.waitForSelector('ytd-transcript-segment-renderer', { timeout: 10000 });

    const transcript = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('ytd-transcript-segment-renderer'))
        .map(el => el.querySelector('yt-formatted-string').textContent)
        .join(' ');
    });

    await browser.close();
    res.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ error: 'Failed to fetch transcript. Ensure the video has transcripts enabled.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
