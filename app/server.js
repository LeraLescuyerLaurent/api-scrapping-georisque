// const fetch = require('node-fetch');
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const chromium = require('chrome-aws-lambda');
// const puppeteer = require('puppeteer-core');


import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
const app = express();
// const codeInsee = '01249';
// const codePostal = '01700';
// const commune = 'miribel';


app.use(cors({ 
    origin : '*'
}));

app.get('/api/georisque/commune/:codeInsee/:codePostal/:commune',async (req, res, next) => {
    const codeInsee = req.params.codeInsee;
    const codePostal = req.params.codePostal;
    const commune = req.params.commune;

    const url = `https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi/rapport?form-commune=true&codeInsee=${codeInsee}&ign=false&CGU-commune=on&commune=${codePostal}+${commune}`;
    const browser = await  puppeteer.launch({
        headless: false,
        args:  args,
        defaultViewport:  defaultViewport,
        // executablePath: 'C:\Program Files\Google\Chrome\Application\chrome.exe' || await  executablePath , 
        ignoreHTTPSErrors: true,
        ignoreDefaultArgs: ['--disable-extensions', '--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote'],
    });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil:  ["load"],
    });
    await page.waitForSelector('.section_rapport_informations > .row > .report-commune-left > #voirplus > a')
    
    await page.waitForSelector('#dest-liste-risque-info')

    await page.waitForSelector('#div_details_majeurs > .row > .col-lg-2 > button ')
    await page.click('#div_details_majeurs > .row > .col-lg-2 > button ')

    await page.waitForSelector('#dest-liste-risque-info')
    const result = await page.evaluate(() => {
        // const urlPrefecture = document.querySelector("#voirplus a").getAttribute("href");
        const listeRisque = document.querySelector("#dest-liste-risque-info").innerHTML;
        return {listeRisque};
    });
    await page.screenshot({ path:'pp.png' });
    await browser.close();
    return res.status(200).json(result);
});





app.listen(process.env.PORT);
