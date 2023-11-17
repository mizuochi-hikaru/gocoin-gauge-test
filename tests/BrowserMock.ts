import { IBrowserFactory, IBrowser, IPage, ILocator } from './BrowserTypes';

export class BrowserMockFactory implements IBrowserFactory {
    public async create(): Promise<IBrowser> {
        return new BrowserMock();
    }
}

class BrowserMock implements IBrowser {
    public async close(): Promise<void> {
    }
    public async newPage(): Promise<IPage> {
        return new PageMock();
    }
}

class PageMock implements IPage {
    public async goto(url: string): Promise<void> {
    }
    public async close(): Promise<void> {
    }
    public locator(): ILocator {
        return new LocatorMock();
    }
    public getByText(): ILocator {
        return new LocatorMock();
    }
    public getByPlaceholder(): ILocator {
        return new LocatorMock();
    }
    public getByLabel(): ILocator {
        return new LocatorMock();
    }
}

class LocatorMock implements ILocator {
    public async click(): Promise<void> {
    }
    public async fill(): Promise<void> {
    }
    public async textContent(): Promise<string> {
        return '';
    }
    public async isDisabled(): Promise<boolean> {
        return false;
    }
    public nth(): ILocator {
        return new LocatorMock();
    }
    public locator(): ILocator {
        return new LocatorMock();
    }
    public getByText(): ILocator {
        return new LocatorMock();
    }
    public getByPlaceholder(): ILocator {
        return new LocatorMock();
    }
    public getByLabel(): ILocator {
        return new LocatorMock();
    }
}
