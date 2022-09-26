const puppeteer = require("puppeteer");

const cornersStatsLeaderUrl =
  "https://www.thestatsdontlie.com/football/stat-leaders/corners/";
const cornersStatsUrl = "https://www.thestatsdontlie.com/corners/";
const leaguesUrl = "https://www.thestatsdontlie.com/football/leagues/";

const favouriteLeague = {
  name: "Serie A",
  area: "Brazil",
  url: "https://www.thestatsdontlie.com/football/n-s-america/brazil/serie-a/",
};

const getPage = async (url) => {
  let browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return page;
};

const getLeagues = async (page, selector = "div > p  a") => {
  const leagues = await page.$$eval(selector, (nodes) =>
    nodes.map((el) => {
      // split league info at array of 2 elements. Eg.: England– Premier League'
      const pieces = el.textContent.split(/\s.\s/g);
      const info = {
        country: pieces[0],
        league: pieces[1],
        url: el.getAttribute("href"),
      };
      return info;
    })
  );
  return leagues;
};

async function getCornersPages(
  page,
  selector = "div.fusion-text.fusion-text-2 > p > select > option"
) {
  // let selector = "div.fusion-text.fusion-text-2 > p > select > option"
  const cornersPages = await page.$$eval(selector, (nodes) =>
    nodes.map((el) => {
      // split league info at array of 2 elements. Eg.: England– Premier League'
      const pieces = el.textContent.split(/\s.\s/g);
      const info = {
        country: pieces[0],
        league: pieces[1],
        url: el.getAttribute("value"),
      };
      return info;
    })
  );
  return cornersPages;
}

async function run() {
  let page = await getPage(leaguesUrl);

  const leagues = await getLeagues(page);
  console.log(leagues);
  page.close();

  page = await getPage(cornersStatsUrl);
  const cornersPages = await getCornersPages(page);
  console.log(cornersPages.length);
}

// run();

let fulltimeCornersAgainst = "a#fusion-tab-fulltimecornersa";
let fulltimeCornersFor = "a#fusion-tab-fulltimecornersf";
let fulltimeMatchCorners = "a#fusion-tab-fulltimematchcorners";

async function fetchCornersFor(urlPage) {
  // const url = "https://www.thestatsdontlie.com/football/n-s-america/argentina/primera-nacional/corners";
  const url =
    "https://www.thestatsdontlie.com/football/n-s-america/brazil/serie-a/corners/";
  const page = await getPage(url);
  const tableUrl = await page.$eval(
    'div[aria-labelledby="fusion-tab-fulltimecornersf"] > div > iframe',
    (el) => el.getAttribute("src")
  );

  const pageTable = await getPage(tableUrl);

  // seleciona linhas da tabela, removendo linhas 1 e 2 de cabeçalhos e a última linha que contém lixo
  const values = await pageTable.$$eval(
    "table tbody tr:nth-child(n+3):not(:last-child)",
    (node) =>
      node.map((rows) => {
        data = [];
        rows.childNodes.forEach((row) => data.push(row.textContent));
        return {
          home: {
            team: data[1],
            games: data[2],
            total: data[3],
            average: data[4],
          },
          away: {
            team: data[5],
            games: data[6],
            total: data[7],
            average: data[8],
          },
          overall: {
            team: data[9],
            games: data[10],
            total: data[11],
            average: data[12],
          },
        };
      })
  );

  console.log(values);
  await pageTable.close();
}

fetchCornersFor();
