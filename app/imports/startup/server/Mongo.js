import { Meteor } from 'meteor/meteor';
import { Emails } from '../../api/email/EmailCollection';
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

function addEmails(data) {
  console.log(`  Adding email: (${data.subject}) ${data.senderEmail} => ${data.recipientEmail}`);
  Emails.define(data);
}

// Initialize the StuffsCollection if empty.
if (Emails.count() === 0) {
  if (Meteor.settings.defaultEmails) {
    console.log('Creating default email.');
    Meteor.settings.defaultEmails.map(data => addEmails(data));
  }
}
