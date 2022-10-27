import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const departmentPositions = ['In Support', 'In Opposition', 'Comments'];
export const offices = ['OCID', 'OFO', 'OFS', 'OHE', 'OITS', 'OSIP', 'OSSS', 'OTM'];
export const testimonyPublications = {
  testimony: 'testimony',
  testimonyAdmin: 'testimonyAdmin', // not sure if we need this.
};

class TestimonyCollection extends BaseCollection {
  constructor() {
    super('Testimonies', new SimpleSchema({
      owner: String,
      committeeChair: String,
      committeeName: String,
      billNumber: Number,
      billDraftNumber: { type: String, optional: true },
      title: { type: String, optional: true },
      hearingDate: { type: Date, optional: true },
      hearingLocation: { type: String, optional: true },
      deptPosition: {
        type: String,
        allowedValues: departmentPositions,
        defaultValue: 'In Support',
      },
      introduction: String,
      content: String,
      closing: { type: String, optional: true },
      testifier: String,
      representing: { type: String, optional: true },
      contactEmail: { type: String, optional: true },
      contactPhone: { type: String, optional: true },
      testimonyProgress: {
        type: Array,
        optional: true,
      },
      'testimonyProgress.$': Number,
      office: { type: String, allowedValues: offices, optional: true },
      reviewerComments: {
        type: Array,
        optional: true,
      },
      'reviewerComments.$': {
        type: new SimpleSchema({
          comment: String,
          // commentDate: Date,
          writer: String,
          writerPosition: String,
          submissionOption: { type: String, allowedValues: ['reject', 'approve'] },
        }),
        optional: true,
      },
    }));
  }

  /**
   * Defines a new Testimony item.
   */
  define({ owner, committeeChair, committeeName, billNumber, billDraftNumber, title, hearingDate, hearingLocation, deptPosition, introduction,
    content, closing, testifier, representing, contactEmail, contactPhone, testimonyProgress, office, reviewerComments }) {
    const docID = this._collection.insert({ owner, committeeChair, committeeName, billNumber, billDraftNumber, title, hearingDate, hearingLocation, deptPosition, introduction,
      content, closing, testifier, representing, contactEmail, contactPhone, testimonyProgress, office, reviewerComments });
    return docID;
  }

  /**
   * Updates the given document.
   */
  update(docID, { owner, committeeChair, committeeName, billNumber, billDraftNumber, title, hearingDate, hearingLocation, deptPosition, introduction,
    content, closing, testifier, representing, contactEmail, contactPhone, testimonyProgress, office, reviewerComments }) {
    const updateData = {};
    if (_.isString(owner)) {
      updateData.owner = owner;
    }
    if (_.isString(committeeChair)) {
      updateData.committeeChair = committeeChair;
    }
    if (_.isString(committeeName)) {
      updateData.committeeName = committeeName;
    }
    if (_.isString(billNumber)) {
      updateData.billNumber = billNumber;
    }
    if (_.isString(billDraftNumber)) {
      updateData.billDraftNumber = billDraftNumber;
    }
    if (_.isString(title)) {
      updateData.title = title;
    }
    if (_.isDate(hearingDate)) {
      updateData.hearingDate = hearingDate;
    }
    if (_.isString(hearingLocation)) {
      updateData.hearingLocation = hearingLocation;
    }
    if (_.isString(deptPosition)) {
      updateData.deptPosition = deptPosition;
    }
    if (_.isString(introduction)) {
      updateData.introduction = introduction;
    }
    if (_.isString(content)) {
      updateData.content = content;
    }
    if (_.isString(closing)) {
      updateData.closing = closing;
    }
    if (_.isString(testifier)) {
      updateData.testifier = testifier;
    }
    if (_.isString(representing)) {
      updateData.representing = representing;
    }
    if (_.isString(contactEmail)) {
      updateData.contactEmail = contactEmail;
    }
    if (_.isString(contactPhone)) {
      updateData.contactPhone = contactPhone;
    }
    if (testimonyProgress) {
      updateData.testimonyProgress = testimonyProgress;
    }
    if (office) {
      updateData.office = office;
    }
    if (reviewerComments) {
      updateData.reviewerComments = reviewerComments;
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
      // get the TestimonyCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(testimonyPublications.testimony, function publish() {
        if (this.userId) {
          return instance._collection.find({});
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

  getCollectionName() {
    return this._collection.name;
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
    const owner = doc.owner;
    const committeeChair = doc.committeeChair;
    const committeeName = doc.committeeName;
    const billNumber = doc.billNumber;
    const billDraftNumber = doc.billDraftNumber;
    const title = doc.title;
    const hearingDate = doc.hearingDate;
    const hearingLocation = doc.hearingLocation;
    const deptPosition = doc.deptPosition;
    const introduction = doc.introduction;
    const content = doc.content;
    const closing = doc.closing;
    const testifier = doc.testifier;
    const representing = doc.representing;
    const contactEmail = doc.contactEmail;
    const contactPhone = doc.contactPhone;
    const testimonyProgress = doc.testimonyProgress;
    const office = doc.office;
    return {
      owner,
      committeeChair,
      committeeName,
      billNumber,
      billDraftNumber,
      title,
      hearingDate,
      hearingLocation,
      deptPosition,
      introduction,
      content,
      closing,
      testifier,
      representing,
      contactEmail,
      contactPhone,
      testimonyProgress,
      office,
    };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Testimonies = new TestimonyCollection();
