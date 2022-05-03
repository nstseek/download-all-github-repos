import puppeteer from 'puppeteer';

const username = 'NSTSeek';

const reposUrl = 'https://github.com/nstseek/repositories';

const getRepoUrl = (page: number) => `${reposUrl}?page=${page}`;

const getRepoSelector = (index: number) =>
    `#org-repositories > div > div > div.Box > ul > li:nth-child(${index}) > div > div.d-flex.flex-justify-between > div.flex-auto > h3 > a`;

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                `--user-data-dir=C:/Users/${username}/AppData/Local/Google/Chrome/User Data`,
            ],
        });
        const page = await browser.newPage();
        await page.goto(reposUrl, {
            waitUntil: 'networkidle2',
        });
        const reposPageCount = await page.evaluate(() => {
            // this will probably break if you have more than 5 repo pages
            return (
                document.querySelectorAll(
                    '#org-repositories > div > div > div.paginate-container.d-none.d-md-flex.flex-md-justify-center > div > *'
                ).length - 2
            );
        });
        for (let i = 1; i <= reposPageCount; i++) {
            await page.goto(getRepoUrl(i), {
                waitUntil: 'networkidle2',
            });
            const reposCount = await page.evaluate(() => {
                return document.querySelectorAll(
                    '#org-repositories > div > div > div.Box > ul > li > div > div.d-flex.flex-justify-between > div.flex-auto > h3 > a'
                ).length;
            });
            for (let j = 1; j <= reposCount; j++) {
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                    page.click(getRepoSelector(j)),
                ]);
                await page.click(
                    '#repo-content-pjax-container > div > div > div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end > div.Layout-main > div.file-navigation.mb-3.d-flex.flex-items-start > span > get-repo > feature-callout > details > summary'
                );
                await page.click(
                    '#repo-content-pjax-container > div > div > div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end > div.Layout-main > div.file-navigation.mb-3.d-flex.flex-items-start > span > get-repo > feature-callout > details > div > div > div:nth-child(1) > ul > li:nth-child(3) > a'
                );
                await page.waitForTimeout(500);
                await page.goto(getRepoUrl(i), {
                    waitUntil: 'networkidle2',
                });
            }
        }
        await browser.close();
    } catch (err) {
        console.log(err);
    }
})();
