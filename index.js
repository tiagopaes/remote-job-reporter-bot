require('dotenv').config();
const axios = require('axios');

const run = async () => {
  try {
    const apiUrl = 'https://remoteok.io/api?tag=dev';
    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36';
    const options = { headers: { 'User-Agent': userAgent } };
    const response = await axios.get(apiUrl, options);

    const jobs = await response.data;
    jobs.shift();

    let text = "Today's Remote Jobs\n\n\n";
    text += 'Mobile\n';
    text += '==============================\n';
    jobs
      .filter((job) => job.tags.includes('mobile'))
      .slice(0, 5)
      .forEach((job) => {
        text += `${job.position} at ${job.company} \n`;
        text += `${job.url} \n\n`;
      });

    text += '\nFrontend\n';
    text += '==============================\n';
    jobs
      .filter((job) => job.tags.includes('frontend'))
      .slice(0, 5)
      .forEach((job) => {
        text += `${job.position} at ${job.company} \n`;
        text += `${job.url} \n\n`;
      });

    text += '\nBackend\n';
    text += '==============================\n';
    jobs
      .filter((job) => job.tags.includes('backend'))
      .slice(0, 5)
      .forEach((job) => {
        text += `${job.position} at ${job.company} \n`;
        text += `${job.url} \n\n`;
      });
    text += '\nTo access the complete list access https://remoteok.io';

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const data = {
      chat_id: '@remotejobsfordevs',
      disable_web_page_preview: true,
      text
    };
    await axios.post(telegramUrl, data);
  } catch (err) {
    console.log(err);
  }
};

run();
