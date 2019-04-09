import * as puppeteer from 'puppeteer';
import {rp5} from "./dataSources";
import {Page} from "puppeteer";
import {rp5configs} from "./rp5configs";
import fetch from 'node-fetch';
import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";

fs.mkdir(path.join(__dirname, 'rawData'),err => {
    if (err) {
        throw err;
    }
});

const fromDate = '01.02.2019';
const toDate = '01.04.2019';

puppeteer.launch().then(async browser => {
    const page = await browser.newPage();

    await openCSVTab(page);

    await setDate(fromDate, rp5configs.dateFromId, page);
    await setDate(toDate, rp5configs.dateToId, page);

    await setCSVFormat(page);

    await page.click(rp5configs.createCSVSelector);

    await awaitSelector(rp5configs.loadCSVSelector, page);
    const link = await page.evaluate((selector: string) => {
        return (<HTMLBaseElement>document.querySelector(selector)).href;
    }, rp5configs.loadCSVSelector);
    const response = await fetch(link);
    if (response.ok) {
        const dest = fs.createWriteStream(path.join(__dirname, 'rawData', 'test.csv'));
        response.body.pipe(zlib.createUnzip()).pipe(dest);
    } else {
        console.log(`Error. Response status: ${response.status}`);
    }
    await browser.close();
});

const openCSVTab = async (page: Page) => {
    await page.goto(rp5, {waitUntil: "networkidle2"});
    await page.click(rp5configs.tabId);
};

const setDate = async (date: string, id: string, page: Page) => {
    const idSelector = `#${id}`;
    await awaitSelector(idSelector, page);
    await removeDefaultInput(id, page);
    await page.type(idSelector, date, {delay: 100});
};

const setCSVFormat = async (page: Page) => {
    // for some reason, these selectors cannot be found by common Page functions
    await page.evaluate((csvId, utf8Id) => {
        const inputFormat: HTMLInputElement = document.querySelector(csvId);
        inputFormat.click();
        const inputEncoding: HTMLInputElement = document.querySelector(utf8Id);
        inputEncoding.click();
    }, `#${rp5configs.csvId}`, `#${rp5configs.utf8Id}`);
};

const awaitSelector = async (selector: string, page: Page) => {
    try {
        await page.waitForSelector(selector);
    } catch (e) {
        console.log(`Error. Selector ${selector} is unavailable`);
    }
};

const removeDefaultInput = async (inputId: string, page: Page) => {
    await page.evaluate((inputId) => {
        (<HTMLInputElement>document.getElementById(inputId)).value = '';
    }, inputId);
};

