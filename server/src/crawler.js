const Nightmare = require('nightmare');

exports.filterResult = (results = {}) => {
  let totalWords = 0;
  let firstTenWords = [];
  results = Object.entries(results);

  for (const [word, count] of results) {
    totalWords += count;

    if (firstTenWords.length < 10) {
      firstTenWords.push({ [word]: count });
    } else {
      for (let i = 0; i < firstTenWords.length; i++) {
        let [key, value] = Object.entries(firstTenWords[i])[0];
        if (count > value) {
          firstTenWords[i] = { [word]: count };
          break;
        }
      }
    }
  }

  return { totalWords, firstTenWords };
};

exports.crawler = async (url) => {
  let scrapedResult = {};

  try {
    const nightmare = new Nightmare({ timeout: 0 });

    console.log('crawling');

    scrapedResult = await nightmare
      .goto(url)
      .wait('body')
      .evaluate(() => {
        let imageResults = [];
        let textResults = {};

        let images = document.querySelectorAll('img');
        images = [
          ...images,
          ...document.querySelectorAll('input[type="image"]'),
        ];
        let text = document.querySelector('body').innerText;
        text = text.replace(/[\n\r\f\t]/g, ' ');
        text = text.replace(/[ ]{2,}/g, ' ');
        text = text.toLowerCase();

        let state = 'active';

        for (const image of images) {
          let src = image.getAttribute('src');
          if (src) {
            if (!src.startsWith('http')) {
              src = document.location.origin + '/' + src;
            }

            imageResults.push({ src, state });

            state = '';
          }
        }

        for (const word of text.split(' ')) {
          if (/([A-Za-z])+?/.test(word)) {
            if (textResults.hasOwnProperty(word)) {
              textResults[word] += 1;
            } else {
              textResults[word] = 1;
            }
          }
        }

        return { imageResults, textResults };
      });

    return scrapedResult;
  } catch (error) {
    console.log(error);
    throw new Error('failed to crawl');
  }
};
