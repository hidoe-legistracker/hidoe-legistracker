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
      senderName: String,
      senderEmail: String,
      recipientName: String,
      recipientEmail: String,
      date: Date,
      attachment: Object,
      body: String,
    }));
  }

  define({ subject, senderName, senderEmail, recipientName, recipientEmail, date, attachment, body }) {
    const docID = this._collection.insert({
      subject,
      senderName,
      senderEmail,
      recipientName,
      recipientEmail,
      date,
      attachment,
      body,
    });
    return docID;
  }

  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(emailPublications.email, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
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
