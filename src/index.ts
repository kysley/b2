import Puppeteer from "puppeteer";
import cheerio from "cheerio";
import Fastify, { FastifyRequest } from "fastify";
import FastifyCors from "fastify-cors";

const cache = new Map();
let page: Puppeteer.Page;

async function crawlTheme(uri: string) {
  await page.goto(`https://vscodethemes.com/search?q=${uri}`);

  const content = await page.content();

  const $ = cheerio.load(content);

  const texts = $(
    "html body div#__next div.css-nwf324 div.css-dncqyb div.css-1s8s235 div.css-xymwpp div.css-1inptpf div.css-s34702 div.css-swve6m svg.css-ahoycg"
  )
    .first()
    .children()
    .toArray();

  const ddict: Record<string, number> = {};

  texts.forEach((textEl, idx) => {
    const tspans = [...textEl.children];

    // Skip the comment colour
    if (idx === 8) return;

    tspans.forEach((tspan) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const styleAttr = tspan.attribs.style as string;
      const hex = styleAttr.split(";")[0].substring(6);
      if (!ddict[hex]) {
        ddict[hex] = 0;
      }
      ddict[hex] += 1;
    });
  });

  return ddict;
}

const fastify = Fastify({ trustProxy: true });

fastify.register(FastifyCors, {
  origin: ["http://localhost:8800", "https://bpc.e8y.fun"],
});

type PeerManagerGetRequest = FastifyRequest<{
  Querystring: {
    search: string;
  };
}>;
fastify.get("/", async (req: PeerManagerGetRequest, res) => {
  const { search } = req.query;
  if (!search) return res.status(404).send();

  const uri = encodeURI(search.toLowerCase());

  if (cache.has(uri)) {
    res.send(cache.get(uri));
    return;
  }

  const resp = await crawlTheme(uri);
  cache.set(uri, resp);

  res.send(resp);
});

fastify.get("/health", async () => {
  // Random search that only has one theme
  // this is a super fragile health test tbfh
  const resp = await crawlTheme(encodeURI("Taarú Teranga"));

  if (resp["#000000"] !== 32) {
    return false;
  }
  return true;
});

const start = async () => {
  try {
    const browser = await Puppeteer.launch();
    page = await browser.newPage();
    await fastify.listen(3600);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

start();
