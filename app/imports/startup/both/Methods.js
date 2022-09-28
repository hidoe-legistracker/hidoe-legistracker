import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const setPassword = 'Password.set';

Meteor.methods({
  'Password.set'({ userId, password }) {
    Accounts.setPassword(userId, password);
  },
});

export { setPassword };
