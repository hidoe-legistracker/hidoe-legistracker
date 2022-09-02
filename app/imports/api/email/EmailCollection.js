import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class EmailCollection extends BaseCollection {
  constructor() {
    super('Emails', new SimpleSchema({
      subject: String,
      sender: String,
      senderEmail: String,
      recipient: String,
      recipientEmail: String,
      date: Date,
      attachment: Object,
      body: String,
    }));
  }
}

export const Emails = new EmailCollection();
