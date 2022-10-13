import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class InboxPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.INBOX}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to create measure. */
  async createEmail() {
    await this.isDisplayed();
    await t.click(`#${COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON}`);
    await t.expect(Selector(`#${COMPONENT_IDS.INBOX_CREATE_EMAIL_MODAL}`)).ok();
  }
}

export const inboxPage = new InboxPage();
