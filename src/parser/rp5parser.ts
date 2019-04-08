import * as puppeteer from 'puppeteer';
import {rp5} from "./dataSources";
import {Page} from "puppeteer";

const fromDate = '01.02.2019';
const toDate = '01.04.2019';

const DOWNLOAD_PATH = '/home/moonmoon/WebstormProjects/Krasnovidovo-backend-typeorm/src/csvToPostgres/rawData';

puppeteer.launch({headless: false}).then(async browser => {
    const page = await browser.newPage();
    await page.goto(rp5);
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.dismiss();
    });
    await page.click('#tabSynopDLoad');
    await setFromDate(fromDate, page);
    await setToDate(toDate, page);
    await setCSVFormat(page);
    await page.click('#divSynopDLoad .archButton');
    await page.waitFor(1000);
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath:  DOWNLOAD_PATH
    });

    try {
        await page.click('#divSynopDLoad a');
    } catch (e) {
        console.log('oops');
    }
    //
    // await browser.close();
});

const setFromDate = async (fromDate: string, page: Page) => {
    await page.evaluate(() => {
        const dateFromInput = document
            .getElementById('calender_dload') as HTMLInputElement;
        dateFromInput.value = '';
    });
    await page.focus('#calender_dload');
    await page.type('#calender_dload', fromDate, {delay: 100});
};

const setToDate = async (toDate: string, page: Page) => {
    await page.evaluate(() => {
        const dateFromInput = document
            .getElementById('calender_dload2') as HTMLInputElement;
        dateFromInput.value = '';
    });
    await page.focus('#calender_dload2');
    await page.type('#calender_dload2', toDate, {delay: 100});
};

const setCSVFormat = async (page: Page) => {
    await page.evaluate(() => {
        const inputFormat: HTMLInputElement = document.querySelector('#format2');
        inputFormat.click();
        const inputEncoding: HTMLInputElement = document.querySelector('#coding2');
        inputEncoding.click();
    });
};
