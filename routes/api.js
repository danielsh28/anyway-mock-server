const express = require('express');
const router = express.Router();
const  fetch = require('node-fetch');
const NodeCache = require('node-cache');
const ttl = 1000*60*60*2;
const newsCache = new NodeCache();
const ANYWAY_URL = 'https://anyway.co.il/';

const  getDataFromApi = (url) => {
    return fetch(url)
        .then((realServerRes)=>realServerRes.json()).catch(err=>console.log(err));
};


setInterval(()=>newsCache.flushAll(),ttl);

async function getNewsFromCache(urlAsKey){
    let dataFromCache;
    dataFromCache = newsCache.get(urlAsKey);
    if(dataFromCache === undefined){
        dataFromCache = await getDataFromApi(urlAsKey);
        newsCache.set(urlAsKey,dataFromCache);
    }
    return dataFromCache;
}



router.get('/*' ,async function (req,res){
    const url = `${ANYWAY_URL}${req.url}`;
    const dateToSend = await  getNewsFromCache(url);
    res.send(dateToSend);
});


module.exports= router;
