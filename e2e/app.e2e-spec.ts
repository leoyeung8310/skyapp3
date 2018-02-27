import { SkyappPage } from './app.po';

describe('skyapp App', () => {
  let page: SkyappPage;

  beforeEach(() => {
    page = new SkyappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
