import axios from 'axios';
import * as cheerio from 'cheerio';


async function scrapeDorms() {
  const urlResponse = await axios.get(
    "https://scl.cornell.edu/residential-life/housing/campus-housing/first-year-undergraduates-campus-housing"
  );
  const $ = cheerio.load(urlResponse.data);
  const dormLinks = [];

  $('#main-content #main #main-article ul li a:not(:has(span.limiter))').each((i, element) => {
    const link = $(element).attr("href");
    const text = $(element).text().trim();

    dormLinks.push({
      name: text,
      link: `https://scl.cornell.edu${link}`,
      summary: ''
    });

  });
  for (const dorm of dormLinks) {
    await scrapeDormPage(dorm);
  }

  return dormLinks;
};

async function scrapeDormPage(dorm) {
  const response = await axios.get(dorm.link);
  const $ = cheerio.load(response.data);
  const introText = $('#main-content #main #main-article .intro').text().trim();
  dorm.summary = introText;
};

export default scrapeDorms;