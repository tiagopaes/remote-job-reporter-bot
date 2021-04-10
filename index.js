require('dotenv').config();
const axios = require('axios');
const {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID_TO_NOTIFY,
  TELEGRAM_API_URL,
  REMOTEOK_API_URL,
  REMOTEOK_WEBSITE_URL,
  JOB_TAGS,
  JOBS_PER_TAG,
} = process.env;

run();

async function run() {
  try {
    const jobs = await getJobs();
    const tags = JOB_TAGS.split(',');

    let text = "Today's Remote Jobs\n\n";
    tags.forEach((tag) => {
      text += buildText(jobs, tag);
      text += '\n';
    });
    text += `To see the full list, visit ${REMOTEOK_WEBSITE_URL}`;

    await sendMessage(text);
  } catch (err) {
    console.log(err);
  }
}

async function getJobs() {
  const userAgent =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36';
  const options = { headers: { 'User-Agent': userAgent } };
  const response = await axios.get(`${REMOTEOK_API_URL}?tag=dev`, options);

  const jobs = response.data;
  jobs.shift();

  return jobs;
}

function buildText(jobs, tag) {
  let text = capitalize(tag) + '\n';
  text += '==============================\n';
  jobs
    .filter((job) => job.tags.includes(tag))
    .slice(0, JOBS_PER_TAG)
    .forEach((job) => {
      text += `${job.position} at ${job.company} \n`;
      text += `${job.url} \n\n`;
    });

  return text;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function sendMessage(text) {
  const url = `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const data = {
    chat_id: TELEGRAM_CHAT_ID_TO_NOTIFY,
    disable_web_page_preview: true,
    text,
  };
  await axios.post(url, data);
}
