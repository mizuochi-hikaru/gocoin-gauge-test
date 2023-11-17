
export interface IBrowserFactory {
    create(options?: object): Promise<IBrowser>;
}

export interface IBrowser {
    close(): Promise<void>;
    newPage(options?: object): Promise<IPage>;
}

export interface IPage {
    goto(url: string, options?: object): Promise<void>;
    close(options?: object): Promise<void>;
    locator(selector: string, options?: object): ILocator;
    getByText(text: string, options?: object): ILocator;
    getByPlaceholder(placeholder: string, options?: object): ILocator;
    getByLabel(label: string, options?: object): ILocator
}

export interface ILocator {
    click(options?: object): Promise<void>;
    fill(text: string): Promise<void>;
    textContent(options?: object): Promise<string>;
    nth(index: number): ILocator;
    isDisabled(options?: object): Promise<boolean>;
    locator(selector: string, options?: object): ILocator;
    getByText(text: string, options?: object): ILocator;
    getByPlaceholder(placeholder: string, options?: object): ILocator;
    getByLabel(label: string, options?: object): ILocator
}
