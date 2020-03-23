const express = require('express');
const router = express.Router();
const  fetch = require('node-fetch');
const NodeCache = require('node-cache');
const CACHE_KEY = 'lastNews';
const ttl = 1000*5;
const newsCache = new NodeCache();

const  getNewsFromApi = () => {
    return fetch('https://anyway.co.il/api/news-flash-filters?news_flash_count=10')
        .then((realServerRes)=>realServerRes.json())
};

async function initCache(){
    console.log(newsCache.getTtl(CACHE_KEY));
    await getNewsFromApi().then((jsonObject) => {
        newsCache.set(CACHE_KEY, jsonObject);
    })
};
initCache();
setInterval(initCache,ttl);

async function getNewsFromCache(fetchApiFunc){
    let val;
    val = newsCache.get(CACHE_KEY);
    return val;
}



router.get('/' ,async function (req,res){
    const   newsdata = await getNewsFromCache();
    res.send(newsdata);
});


module.exports= router;
