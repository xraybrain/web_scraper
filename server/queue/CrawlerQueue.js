const Bull = require('bull');
let RedisHost = '127.0.0.1';
let RedisPort = 6379;
const { crawler, filterResult } = require('../src/crawler');

const extractPort = (url) => url.substr(url.lastIndexOf(':') + 1);
const extractUrl = (url) => url.substr(0, url.lastIndexOf(':'));

if (process.env.REDIS_URL) {
  RedisHost = extractUrl(process.env.REDIS_URL);
  RedisPort = extractPort(process.env.REDIS_URL);
}

console.log(RedisHost, RedisPort);

const CreateCrawlerQueue = () => {
  const CrawlerQueue = new Bull('WEB_CRAWLER', {
    redis: {
      port: RedisPort,
      host: RedisHost,
    },
  });

  CrawlerQueue.process(async (job, done) => {
    const baseURL = job.data.url;

    try {
      const scrapedResult = await crawler(baseURL);
      const wordsResult = filterResult(scrapedResult.textResults);

      global.io.emit('SCRAPE_RESULT', {
        error: null,
        imageResults: scrapedResult.imageResults,
        wordsResult,
      });
      //await job.remove();
      done();
    } catch (error) {
      await job.moveToFailed({ message: 'failed' });
      console.log(error);
      global.io.emit('SCRAPE_RESULT', {
        error: true,
        imageResults: [],
        wordsResult: {},
      });
    }
  });

  return CrawlerQueue;
};

module.exports = { CreateCrawlerQueue };
