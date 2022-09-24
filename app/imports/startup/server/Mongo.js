import { Meteor } from 'meteor/meteor';
import { Measures } from '../../api/measure/MeasureCollection';

// import { Emails } from '../../api/email/EmailCollection';
/*
import { Stuffs } from '../../api/stuff/StuffCollection

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}
*/

// function addEmails(data) {
//   console.log(`  Adding email: (${data.subject}) ${data.senderEmail} => ${data.recipientEmail}`);
//   Emails.define(data);
// }

// Initialize the StuffsCollection if empty.
// if (Emails.count() === 0) {
//   if (Meteor.settings.defaultEmails) {
//     console.log('Creating default email.');
//     Meteor.settings.defaultEmails.map(data => addEmails(data));
//   }
// }
function addMeasures(data) {
  // eslint-disable-next-line no-console
  console.log(`  Adding: Bill ${data.code}`);
  Measures._collection.insert(data);
}

/**
 * If the loadAssetsFile field in settings.development.json is true, then load the data in private/data.json.
 * This approach allows you to initialize your system with large amounts of data.
 * Note that settings.development.json is limited to 64,000 characters.
 * We use the "Assets" capability in Meteor.
 * For more info on assets, see https://docs.meteor.com/api/assets.html
 */

if (Meteor.settings.loadAssetsFile && Meteor.isServer) {
  const measureData = JSON.parse(Assets.getText('measures.json'));
  measureData.measures.map(measures => addMeasures(measures));
}
