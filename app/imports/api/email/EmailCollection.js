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
      attachment: { type: Object, optional: true },
      body: String,
      isRead: { type: Boolean, defaultValue: false },
    }));
  }

  define({ subject, senderName, senderEmail, recipientName, recipientEmail, date, attachment, body, isRead }) {
    const docID = this._collection.insert({
      subject,
      senderName,
      senderEmail,
      recipientName,
      recipientEmail,
      date,
      attachment,
      body,
      isRead,
    });
    return docID;
  }

  update(docID, { isRead }) {
    const updateData = {};
    if (isRead) {
      updateData.isRead = isRead;
    }
    this._collection.update(docID, { $set: updateData });
  }

  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(emailPublications.email, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ recipientEmail: username });
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
