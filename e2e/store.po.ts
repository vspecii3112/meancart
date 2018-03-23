import { browser, by, element } from 'protractor';

export class HomePage {
  navigateTo() {
    return browser.get('/');
  }

  pause() {
    return browser.pause();
    //return browser.waitForAngular;
  }

  getListCoins() {
    return element.all(by.id('listOfCoins'));
    //return element.all(by.id('listOfCoins')).all(by.id('addItemButton'));
  }

  addItemButton(index: number) {
    return element.all(by.id('listOfCoins')).get(index).element(by.id('addItemButton'));
  }

  cartLink() {
    return element(by.id("cartLink"))
  }
  
}
