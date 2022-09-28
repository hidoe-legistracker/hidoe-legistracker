import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import Select from 'react-select';
import { PAGE_IDS } from '../utilities/PageIDs';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Emails } from '../../api/email/EmailCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

/* Renders the CreateEmail page for composing emails. */
const CreateEmail = () => {

  const email = {
    subject: '',
    recipients: [],
    ccs: [],
    bccs: [],
    date: '',
    body: '',
  };

  const { thisUser, users, ready } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();

    const usrs = UserProfiles.find({}, {}).fetch().concat(AdminProfiles.find({}, {}).fetch());
    const formattedUsers = [];
    usrs.forEach(user => {
      formattedUsers.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user._id });
    });

    let thisUsr = UserProfiles.findOne({ email: currUser }, {});
    if (thisUsr === undefined) thisUsr = AdminProfiles.findOne({ email: currUser }, {});
    return {
      thisUser: thisUsr,
      users: formattedUsers,
      ready: rdy,
    };
  }, []);

  const updateEmail = (event, property) => {
    email[property] = event;
  };

  // On submit, insert the data.
  const submit = () => {
    const { subject, body } = email;
    const recipients = [];
    const ccs = [];
    const bccs = [];

    if (subject === '' || email.recipients.length === 0 || body === '') {
      return;
    }

    email.recipients.forEach(recipient => {
      recipients.push(recipient.value);
    });
    email.ccs.forEach(cc => {
      ccs.push(cc.value);
    });
    email.bccs.forEach(bcc => {
      bccs.push(bcc.value);
    });

    const senderEmail = thisUser.email;
    const senderName = `${thisUser.firstName} ${thisUser.lastName}`;
    const date = new Date(); // new Date(new Date().toLocaleDateString()).toISOString().substring(0, 10);
    const collectionName = Emails.getCollectionName();
    const definitionData = { subject, senderName, senderEmail, recipients, ccs, bccs, date, body };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Email Sent!', 'success');
      });
  };

  return ready ? (
    <Container id={PAGE_IDS.CREATE_EMAIL} className="py-3">
      <Row className="justify-content-center">
        <Form>
          <Form.Group className="to">
            <Form.Label>To: *</Form.Label>
            <Select id="email-to" options={users} isMulti closeMenuOnSelect={false} onChange={(e) => updateEmail(e, 'recipients')} />
          </Form.Group>
          <Form.Group className="cc">
            <Form.Label>Cc: </Form.Label>
            <Select id="email-cc" options={users} isMulti closeMenuOnSelect={false} onChange={(e) => updateEmail(e, 'ccs')} />
          </Form.Group>
          <Form.Group className="bcc">
            <Form.Label>Bcc: </Form.Label>
            <Select id="email-bcc" options={users} isMulti closeMenuOnSelect={false} onChange={(e) => updateEmail(e, 'bccs')} />
          </Form.Group>
          <Form.Group className="from">
            <Form.Label>From: </Form.Label>
            <Form.Control plaintext readOnly defaultValue={`${thisUser.firstName} ${thisUser.lastName} (${thisUser.email})`} />
          </Form.Group>
        </Form>
        <Container>
          <hr />
        </Container>
        <Form>
          <Form.Group className="subject">
            <Form.Label>Subject: </Form.Label>
            <Form.Control type="subject" placeholder="" onChange={(e) => updateEmail(e.target.value, 'subject')} />
          </Form.Group>
          <Form.Group className="body">
            <Form.Label> </Form.Label>
            <Form.Control type="body" as="textarea" rows={5} onChange={(e) => updateEmail(e.target.value, 'body')} />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label />
            <Form.Control type="file" />
          </Form.Group>
        </Form>
        <Col>
          <Button type="button" onClick={submit} variant="primary" size="lg">Send</Button>
        </Col>
      </Row>
    </Container>
  ) : '';
};

export default CreateEmail;
