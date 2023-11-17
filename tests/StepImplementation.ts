
import { Step, Table, BeforeSuite, AfterSuite, BeforeSpec, DataStoreFactory } from 'gauge-ts';
import { IBrowserFactory, IBrowser, IPage, ILocator } from './BrowserTypes';
import { appUrl, isHeadless } from './env';
import { deepStrictEqual } from 'assert';

/*
全部仮想実装、イマジナリー実装
*/

export default class StepImplementation {
    private static _browserFactory: IBrowserFactory;

    @BeforeSuite()
    public async beforeSuite() {
        await StepImplementation._getSpecBrowser({ headless: isHeadless });
    }
    @AfterSuite()
    public async afterSuite() {
        await StepImplementation._closeBrowser();
    };

    @BeforeSpec()
    public async beforeSpec() {
        await StepImplementation._goto(appUrl);
    }

    private static async _getInputLocator(caption: string): Promise<ILocator> {
        const page = await this._getSpecPage();
        const div = page.locator('div', { has: page.getByText(caption) });
        return div.locator('input');
    }

    @Step('キャプション<caption>の入力窓のプレースホルダが<placeholder>であること')
    public async captionPlaceholder(caption: string, placeholder: string) {
        const locator = await StepImplementation._getInputLocator(caption);
        deepStrictEqual(await locator.textContent(), placeholder);
    }

    @Step('キャプション<caption>の入力窓に<text>を入力する')
    public async captionInput(caption: string, text: string) {
        const locator = await StepImplementation._getInputLocator(caption);
        await locator.fill(text);
    }

    @Step('キャプション<caption>の入力窓からフォーカスを外す')
    public async captionBlur(caption: string) {
        const page = await StepImplementation._getSpecPage();
        // 適当なところをクリックする
        await page.getByLabel('支払いの割合').click();
    }

    @Step('<error>のエラーが表示されていること')
    public async error(error: string) {
        // TODO: エラーが表示されていることを確認する
    }

    @Step('エラーが<count>件表示されていること')
    public async errorCount(count: number) {
        // TODO: エラーが表示されていることを確認する
    }

    @Step('キャプション<caption>のボタンがアクティブで<yesOrNo>こと')
    public async captionButtonActive(caption: string, yesOrNo: string) {
        const page = await StepImplementation._getSpecPage();
        const button = page.getByText(caption);
        const disabled = await button.isDisabled();
        deepStrictEqual(disabled, yesOrNo !== 'ある');
    }

    @Step('「支払いの割合」スライダーで、自分側を<me>に設定する')
    public async sliderMe(me: string) {
        const page = await StepImplementation._getSpecPage();
        const slider = page.getByLabel('支払いの割合');
        await slider.fill(me);
    }

    @Step('「支払いの割合」スライダーを動かしたとき、テーブルの通りとなること <table>')
    public async slider(table: Table) {
        const page = await StepImplementation._getSpecPage();
        const slider = page.getByLabel('支払いの割合');
        for (const row of table.getTableRows()) {
            const [me, you] = row.getCellValues();
            await slider.fill(me);
            const meLocator = page.getByText(me);
            const youLocator = page.getByText(you);
            deepStrictEqual(await meLocator.textContent(), me);
            deepStrictEqual(await youLocator.textContent(), you);
        }
    }

    @Step('人数・金額・割合から計算した支払額がテーブルの通りとなること <table>')
    public async calculate(table: Table) {
        const page = await StepImplementation._getSpecPage();
        for (const row of table.getTableRows()) {
            const [me, you, amount, ratio, myprice, yourprice, charge] = row.getCellValues();
            await this.captionInput('自分側の人数', me);
            await this.captionInput('相手側の人数', you);
            await this.captionInput('金額', amount);
            await this.sliderMe(ratio);
            const actualme = await page.getByText('自分側').textContent();
            const actualyou = await page.getByText('相手側').textContent();
            const actualcharge = await page.getByText('お釣り').textContent();
            deepStrictEqual(actualme, myprice);
            deepStrictEqual(actualyou, yourprice);
            deepStrictEqual(actualcharge, charge);
        }
    }

    private static async _getSpecBrowser(options?: any): Promise<IBrowser> {
        try {
            return DataStoreFactory.getSpecDataStore().get('browser');
        } catch (e) {
            const browser = await this._browserFactory.create(options);
            DataStoreFactory.getSpecDataStore().put('browser', browser);
            return browser;
        }
    }
    private static async _closeBrowser() {
        const browser = await this._getSpecBrowser();
        await browser.close();
    }
    private static async _getSpecPage(): Promise<IPage> {
        try {
            return DataStoreFactory.getSpecDataStore().get('page');
        } catch (e) {
            const page = await (await this._getSpecBrowser()).newPage();
            DataStoreFactory.getSpecDataStore().put('page', page);
            return page;
        }
    }
    private static async _goto(url: string) {
        const page = await this._getSpecPage();
        await page.goto(url);
    }
}
