import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const emailPublications = {
  email: 'Email',
  emailAdmin: 'EmailAdmin',
};

class EmailCollection extends BaseCollection {
  constructor() {
    super('Emails', new SimpleSchema({
      subject: String,
      senderName: { type: String, optional: true },
      senderEmail: String,
      recipients: Array,
      'recipients.$': String,
      ccs: { type: Array, optional: true },
      'ccs.$': String,
      bccs: { type: Array, optional: true },
      'bccs.$': String,
      date: Date,
      attachment: { type: Object, optional: true },
      body: String,
      isRead: { type: Array, defaultValue: [] },
      'isRead.$': String,
      isDraft: { type: Boolean, defaultValue: true },
    }));
  }

  define({ subject, senderName, senderEmail, recipients, ccs, bccs, date, attachment, body, isRead, isDraft }) {
    const docID = this._collection.insert({
      subject,
      senderName,
      senderEmail,
      recipients,
      ccs,
      bccs,
      date,
      attachment,
      body,
      isRead,
      isDraft,
    });
    return docID;
  }

  update(docID, { isRead, isDraft, subject, recipients, ccs, bccs, date, body }) {
    const updateData = {};
    if (isRead !== undefined) {
      updateData.isRead = isRead;
    }
    if (isDraft !== undefined) {
      updateData.isDraft = isDraft;
    }
    if (subject) {
      updateData.subject = subject;
    }
    if (recipients && recipients.length > 0) {
      updateData.recipients = recipients;
    }
    if (ccs && ccs.length > 0) {
      updateData.ccs = ccs;
    }
    if (bccs && bccs.length > 0) {
      updateData.bccs = bccs;
    }
    if (date) {
      updateData.date = date;
    }
    if (body) {
      updateData.body = body;
    }
    this._collection.update(docID, { $set: updateData });
  }

  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(emailPublications.email, function publish() {
        if (this.userId) {
          return instance._collection.find({});
        }
        return this.ready();
      });

      Meteor.publish(emailPublications.emailAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribeEmail() {
    if (Meteor.isClient) {
      return Meteor.subscribe(emailPublications.email);
    }
    return null;
  }

  subscribeEmailAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(emailPublications.emailAdmin);
    }
    return null;
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }
}

export const Emails = new EmailCollection();
