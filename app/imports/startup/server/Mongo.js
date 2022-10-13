import { Meteor } from 'meteor/meteor';
import { Measures } from '../../api/measure/MeasureCollection';
// import { Emails } from '../../api/email/EmailCollection';

// function addEmails(data) {
//   console.log(`  Adding email: (${data.subject}) ${data.senderEmail} => ${data.recipientEmail}`);
//   Emails.define(data);
// }

function addMeasures(data) {
  // eslint-disable-next-line no-console
  console.log(`  Adding: Bill ${data.code}`);
  Measures._collection.insert(data);
}
/**
function addEmails(data) {
  // eslint-disable-next-line no-console
  console.log(`  Adding: Email ${data.code}`);
  Emails._collection.insert(data);
}
* */
/**
 * If the loadAssetsFile field in settings.development.json is true, then load the data in private/data.json.
 * This approach allows you to initialize your system with large amounts of data.
 * Note that settings.development.json is limited to 64,000 characters.
 * We use the "Assets" capability in Meteor.
 * For more info on assets, see https://docs.meteor.com/api/assets.html
 */

if (Meteor.settings.loadAssetsFile && Meteor.isServer) {
  if (Measures.count() === 0) {
    const measureData = JSON.parse(Assets.getText('measures.json'));
    measureData.measures.map(measures => addMeasures(measures));
  }
  /**
  if (Emails.count() === 0) {
    const emailData = JSON.parse(Assets.getText('email.json'));
    emailData.email.map(emails => addEmails(emails));
  }
   * */
}
