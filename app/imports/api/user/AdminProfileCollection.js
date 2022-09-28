import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseProfileCollection from './BaseProfileCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';

class AdminProfileCollection extends BaseProfileCollection {
  constructor() {
    super('AdminProfile', new SimpleSchema({}));
  }

  /**
   * Defines the profile associated with an Admin and the associated Meteor account.
   * @param email The email associated with this profile. Will be the username.
   * @param password The password for this user.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param employeeID
   * @param role
   * @param newAccount
   */
  define({ userID, email, firstName, lastName, password, employeeID, newAccount, phone, departments }) {
    if (Meteor.isServer) {
      // console.log('define', email, firstName, lastName, password, employeeID, newAccount);
      const username = email;
      const user = this.findOne({ email, firstName, lastName });
      if (!user) {
        const role = ROLE.ADMIN;
        const profileID = this._collection.insert({ email, firstName, lastName, userID: this.getFakeUserId(), employeeID, role, newAccount, phone, departments });
        const newUserID = userID !== undefined ? userID : Users.define({ username, role, password });
        this._collection.update(profileID, { $set: { userID: newUserID } });
        return profileID;
      }
      return user._id;
    }
    return undefined;
  }

  /**
   * Updates the AdminProfile. You cannot change the email or role.
   * @param docID the id of the AdminProfile
   * @param firstName new first name (optional).
   * @param lastName new last name (optional).
   * @param myFolders array of folders of measures (optional)
   * @param departments
   * @param phone
   * @param role
   */
  update(docID, { firstName, lastName, myFolders, departments, phone, role, newAccount }) {
    this.assertDefined(docID);
    const updateData = {};
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
    }
    if (myFolders) {
      updateData.myFolders = myFolders;
    }
    if (departments) {
      updateData.departments = departments;
    }
    if (phone) {
      updateData.phone = phone;
    } else {
      updateData.phone = '';
    }
    if (role) {
      updateData.role = role;
    }
    if (newAccount !== undefined) {
      updateData.newAccount = newAccount;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes this profile, given its profile ID.
   * Also removes this user from Meteor Accounts.
   * @param profileID The ID for this profile object.
   */
  removeIt(profileID) {
    if (this.isDefined(profileID)) {
      return super.removeIt(profileID);
    }
    return null;
  }

  /**
   * Removes this profile, given its profile ID.
   * @param profileID The ID for this profile object.
   */
  transferIt(profileID) {
    if (this.isDefined(profileID)) {
      return super.transferIt(profileID);
    }
    return null;
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or Admin.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Admin.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks the profile common fields and the role..
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (doc.role !== ROLE.ADMIN) {
        problems.push(`AdminProfile instance does not have ROLE.ADMIN: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the AdminProfile docID in a format acceptable to define().
   * @param docID The docID of a AdminProfile
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const email = doc.email;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    return { email, firstName, lastName };
  }
}

/**
 * Profides the singleton instance of this class to all other entities.
 * @type {AdminProfileCollection}
 */
export const AdminProfiles = new AdminProfileCollection();
