const express = require('express');
const fetch = require('node-fetch');
const googleTrends = require('google-trends-api');
const dotenv = require("dotenv").config();
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/g-latest', async (req,res) => {
  const url = `https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key=${process.env.GUARDIAN_API_KEY}`;
  try {
    const apiResult = await fetch(url);
    const data = await apiResult.json();
    res.json(data);
  }
  catch (error) {
    console.log(error);
  }
});

app.get('/api/g-home', async (req,res) => {
  const url = `https://content.guardianapis.com/search?api-key=${process.env.GUARDIAN_API_KEY}&section=(sport|business|technology|politics)&show-blocks=all`;
  try {
    const apiResult = await fetch(url);
    const data = await apiResult.json();
    res.json(data);
  }
  catch (error) {
    console.log(error);
  }
});

app.get('/api/nyt-home', async (req,res) => {
  const url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${process.env.NYTIMES_API_KEY}`;
  try {
    const apiResult = await fetch(url);
    const data = await apiResult.json();
    res.json(data);
  }
  catch (error) {
    console.log(error);
  }
});

app.get('/api/g-sections/:section', async (req,res) => {
  const section = req.params.section;
  const url = `https://content.guardianapis.com/${section}?api-key=${process.env.GUARDIAN_API_KEY}&show-blocks=all`;
  try {
    const apiResult = await fetch(url);
    const data = await apiResult.json();
    res.json(data);
  }
  catch (error) {
    console.log(error);
  }

});

app.get('/api/nyt-sections/:section', async (req,res) => {
  // Example Request
  // http://localhost:5000/api/nyt-sections/business
  const section = req.params.section;
  const url = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${process.env.NYTIMES_API_KEY}`;
  try {
    const apiResult = await fetch(url);
    const data = await apiResult.json();
    res.json(data);
  }
  catch (error) {
    console.log(error);
  }
});

app.get('/api/g-detail', async (req,res) => {
  // Example Request
  // http://localhost:5000/api/g-detail/?id=business/2020/apr/02/130k-inquiries-1k-loans-why-uk-government-had-to-tweak-help-for-small-firms
  const id = req.query.id;
  const url = `https://content.guardianapis.com/${id}?api-key=${process.env.GUARDIAN_API_KEY}&show-blocks=all`;
  try {
    const apiResult = await fetch(url);
    const data = await apiResult.json();
    res.json(data);
  }
  catch (error) {
    console.log(error);
  }
});

app.get('/api/nyt-detail', async (req,res) => {
  // Example request
  // http://localhost:5000/api/nyt-detail/?id=https://www.nytimes.com/2020/04/02/technology/zoom-linkedin-data.html
  const article_url = req.query.id;
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("${article_url}") &api-key=${process.env.NYTIMES_API_KEY}`;
  try {
    const apiResult = await fetch(url);
    const data = await apiResult.json();
    res.json(data);
  }
  catch (error) {
    console.log(error);
  }
});

app.get('/api/g-search', async (req,res) => {
  // Example Request
  // http://localhost:5000/api/g-search/?search=tesla
  const search = req.query.search;
  const url = `https://content.guardianapis.com/search?q=${search}&api-key=${process.env.GUARDIAN_API_KEY}&show-blocks=all`;
  try {
    const apiResult = await fetch(url);
    const data = await apiResult.json();
    res.json(data);
  }
  catch (error) {
    console.log(error);
  }
});

app.get('/api/nyt-search', async (req,res) => {
  // Example request
  // http://localhost:5000/api/nyt-search/?search=tesla
  const search = req.query.search;
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${search}&api-key=${process.env.NYTIMES_API_KEY}`;
  try {
    const apiResult = await fetch(url);
    const data = await apiResult.json();
    res.json(data);
  }
  catch (error) {
    console.log(error);
  }
});

app.get('/api/g-trending', async (req,res) => {
  // Example Request
  // http://localhost:5000/api/g-trending/?search=amazon
  const search = req.query.search;
  googleTrends.interestOverTime({keyword: search, startTime: new Date("2019-06-01")})
  .then((results) => { res.json(JSON.parse(results)) })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));