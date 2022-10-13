import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
// import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class DirectoryPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.DIRECTORY}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    const waitTime = 15;
    console.log(`Waiting ${waitTime} seconds before running DirectoryPage.isDisplayed().`);
    await t.wait(waitTime * 1000).expect(this.pageSelector.exists).ok();
  }
}

export const directoryPage = new DirectoryPage();
