import { HomePage } from './store.po';
import { browser } from 'protractor';

describe('coin-store App', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
    page.navigateTo();
  });

  it('should count the number of items on the scree', () => {
    expect(page.getListCoins().count()).toEqual(5);
  });

  it('should add each item in the cart', () => {
    page.getListCoins().count().then( count => {
      for(let i=0; i<count; i++) {
        page.addItemButton(i).click();
      }
    });
  });

  it('should add each item in the cart the second time', () => {
    page.getListCoins().count().then( count => {
      for(let i=0; i<count; i++) {
        page.addItemButton(i).click();
      }
    });
  });

  it('should add 2 items to the cart for each item', () => {
    page.getListCoins().count().then( count => {
      for(let i=0; i<count; i++) {
        page.addItemButton(i).click();
        page.addItemButton(i).click();
      }
    });
  });

  it('should have 20 items counted in the cart link text', () => {
    expect(page.cartLink().getText()).toBe("(20)");
  });

  it("should navigate to the shopping cart screen", () => {
    page.cartLink().click();
  });

  afterAll(() => {
    page.pause();
  })

});
