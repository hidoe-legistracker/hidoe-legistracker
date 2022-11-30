import { Meteor } from 'meteor/meteor';
import { ROLE } from '../../api/role/Role';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';

/* eslint-disable no-console */

function createUser(email, role, firstName, lastName, password, employeeID, newAccount, offices, position) {
  console.log(`  Creating user ${email} with role ${role} and position ${position}`);
  if (role === ROLE.ADMIN) {
    AdminProfiles.define({ email, firstName, lastName, password, employeeID, role, newAccount, offices, position });
  } else { // everyone else is just a user.
    UserProfiles.define({ email, firstName, lastName, password, employeeID, role, newAccount, offices, position });
  }
}

// When running app for first time, pass a settings file to set up a default user account.
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.map(({ email, password, role, firstName, lastName, employeeID, newAccount, offices, position }) => createUser(email, role, firstName, lastName, password, employeeID, newAccount, offices, position));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
