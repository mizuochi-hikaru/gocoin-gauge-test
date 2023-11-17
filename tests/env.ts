export const appUrl = process.env.URL || 'http://localhost:3000';
export const isHeadless = process.env.HEADLESS || appUrl === 'http://localhost:3000';
