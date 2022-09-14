import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class CreateMeasurePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADD_MEASURE}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to create measure. */
  async createMeasure() {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.CREATE_MEASURE_FORM_YEAR}`, '2022');
    await t.typeText(`#${COMPONENT_IDS.CREATE_MEASURE_FORM_MEASURE_NUMBER}`, '1');

    const measureTypeSelector = Selector(`#${COMPONENT_IDS.CREATE_MEASURE_FORM_MEASURE_TYPE}`);
    const measureTypeOption = measureTypeSelector.find('option');
    await t.click(measureTypeSelector).click(measureTypeOption.withText('HB')).expect(measureTypeSelector.value).eql('HB');

    const officeSelector = Selector(`#${COMPONENT_IDS.CREATE_MEASURE_FORM_OFFICE}`);
    const officeOption = officeSelector.find('option');
    await t.click(officeSelector).click(officeOption.withText('House: Agriculture')).expect(officeSelector.value).eql('House: Agriculture');

    const actionSelector = Selector(`#${COMPONENT_IDS.CREATE_MEASURE_FORM_ACTION}`);
    const actionOption = actionSelector.find('option');
    await t.click(actionSelector).click(actionOption.withText('Testimony')).expect(actionSelector.value).eql('Testimony');

    await t.click(`#${COMPONENT_IDS.CREATE_MEASURE_FORM_SUBMIT}`);

    await t.expect(Selector(`#${COMPONENT_IDS.CREATE_MEASURE_FORM_CONFIRM}`).visible).eql(true);
  }
}

export const createMeasurePage = new CreateMeasurePage();
