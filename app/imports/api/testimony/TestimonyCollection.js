import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const departmentPositions = ['Support', 'Oppose', 'Comments'];
export const testimonyPublications = {
  testimony: 'testimony',
  testimonyAdmin: 'testimonyAdmin', // not sure if we need this.
};

class TestimonyCollection extends BaseCollection {
  constructor() {
    super('Testimony', new SimpleSchema({
      date: Date,
      time: String,
      owner: String,
      location: String,
      committee: String,
      department: String,
      testifier: String,
      title: String,
      purpose: String,
      deptPosition: {
        type: String,
        allowedValues: departmentPositions,
        defaultValue: 'Support',
      },
    }));
  }

  /**
   * Defines a new Testimony item.
   */
  define({ date, time, owner, location, committee, department, testifier, title, purpose, deptPosition }) {
    const docID = this._collection.insert({ date, time, owner, location, committee, department, testifier, title, purpose, deptPosition });
    return docID;
  }

  /**
   * Updates the given document.
   */
  update(docID, { date, time, location, committee, department, testifier, title, purpose, deptPosition }) {
    const updateData = {};
    if (_.isDate(date)) {
      updateData.date = date;
    }
    if (_.isString(time)) {
      updateData.time = time;
    }
    if (_.isString(location)) {
      updateData.location = location;
    }
    if (_.isString(committee)) {
      updateData.committee = committee;
    }
    if (_.isString(department)) {
      updateData.department = department;
    }
    if (_.isString(testifier)) {
      updateData.testifier = testifier;
    }
    if (_.isString(title)) {
      updateData.title = title;
    }
    if (_.isString(purpose)) {
      updateData.purpose = purpose;
    }
    if (_.isString(deptPosition)) {
      updateData.deptPosition = deptPosition;
    }

    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the StuffCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(testimonyPublications.testimony, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(testimonyPublications.testimonyAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for testimony owned by the current user.
   */
  subscribeTestimony() {
    if (Meteor.isClient) {
      return Meteor.subscribe(testimonyPublications.testimony);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeTestimonyAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(testimonyPublications.testimonyAdmin);
    }
    return null;
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const date = doc.date;
    const time = doc.time;
    const location = doc.location;
    const committee = doc.committee;
    const department = doc.department;
    const testifier = doc.testifier;
    const title = doc.title;
    const purpose = doc.purpose;
    const deptPosition = doc.deptPosition;
    return {
      date,
      time,
      location,
      committee,
      department,
      testifier,
      title,
      purpose,
      deptPosition,
    };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Testimony = new TestimonyCollection();
