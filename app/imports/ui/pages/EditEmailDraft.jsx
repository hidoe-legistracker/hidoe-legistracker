import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import Select from 'react-select';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Emails } from '../../api/email/EmailCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

/* Renders the CreateEmail page for composing emails. */
const EditEmailDraft = () => {
  const { _id } = useParams();
  const [redirect, setRedirect] = useState(false);

  let email = {
    subject: '',
    recipients: [],
    ccs: [],
    bccs: [],
    date: '',
    body: '',
  };

  const { isValidDraft, thisUser, defaultUsers, defaultCcs, defaultBccs, users, emailDraft, retEmail, ready } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const emailSubscription = Emails.subscribeEmail();
    const rdy = userSubscription.ready() && adminSubscription.ready() && emailSubscription.ready();

    const findEmail = Emails.findOne({ _id });
    let valid = true;
    if (findEmail === undefined || findEmail.senderEmail !== currUser) {
      valid = false;
    }

    const ret_email = {
      subject: '',
      recipients: [],
      ccs: [],
      bccs: [],
      date: '',
      body: '',
    };

    const usrs = _.sortBy(UserProfiles.find({}, { }).fetch().concat(AdminProfiles.find({}, {}).fetch()), (obj) => obj.lastName);
    const formattedUsers = [];
    const defaultUsrs = [];
    const defaultCcss = [];
    const defaultBccss = [];
    usrs.forEach(user => {
      formattedUsers.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });

      if (valid) {
        if (findEmail.recipients.indexOf(user.email) >= 0) {
          defaultUsrs.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
          ret_email.recipients.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
        }
        if (findEmail.ccs.indexOf(user.email) >= 0) {
          defaultCcss.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
          ret_email.ccs.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
        }
        if (findEmail.bccs.indexOf(user.email) >= 0) {
          defaultBccss.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
          ret_email.bccs.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
        }
        ret_email.subject = findEmail.subject;
        ret_email.body = findEmail.body;
      }
    });

    let thisUsr = UserProfiles.findOne({ email: currUser }, {});
    if (thisUsr === undefined) thisUsr = AdminProfiles.findOne({ email: currUser }, {});
    return {
      isValidDraft: valid,
      thisUser: thisUsr,
      defaultUsers: defaultUsrs,
      defaultCcs: defaultCcss,
      defaultBccs: defaultBccss,
      users: formattedUsers,
      ready: rdy,
      emailDraft: findEmail,
      retEmail: ret_email,
    };
  }, []);

  if (ready && isValidDraft) {
    email = retEmail;
  }

  const updateEmail = (event, property) => {
    email[property] = event;
  };

  // On submit, insert the data.
  const submit = (type) => {
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

    const date = new Date(); // new Date(new Date().toLocaleDateString()).toISOString().substring(0, 10);
    const collectionName = Emails.getCollectionName();
    const updateData = { id: _id, subject, recipients, ccs, bccs, date, body, isDraft: type === 'draft' };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        if (type === 'draft') {
          swal('Draft Saved', '', 'success');
        } else {
          swal('Success', 'Email Sent!', 'success');
        }
        setRedirect(true);
      });
  };

  if (redirect || (ready && !isValidDraft)) {
    return <Navigate to="/inbox" />;
  }

  return ready ? (
    <Container id={PAGE_IDS.CREATE_EMAIL} className="py-3">
      <Row className="justify-content-center">
        <Form>
          <Form.Group className="to">
            <Form.Label>To: *</Form.Label>
            <Select id="email-to" options={users} isMulti closeMenuOnSelect={false} onChange={(e) => updateEmail(e, 'recipients')} defaultValue={defaultUsers} />
          </Form.Group>
          <Form.Group className="cc">
            <Form.Label>Cc: </Form.Label>
            <Select id="email-cc" options={users} isMulti closeMenuOnSelect={false} onChange={(e) => updateEmail(e, 'ccs')} defaultValue={defaultCcs} />
          </Form.Group>
          <Form.Group className="bcc">
            <Form.Label>Bcc: </Form.Label>
            <Select id="email-bcc" options={users} isMulti closeMenuOnSelect={false} onChange={(e) => updateEmail(e, 'bccs')} defaultValue={defaultBccs} />
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
            <Form.Control type="subject" placeholder="" onChange={(e) => updateEmail(e.target.value, 'subject')} defaultValue={emailDraft.subject} />
          </Form.Group>
          <Form.Group className="body">
            <Form.Label> </Form.Label>
            <Form.Control type="body" as="textarea" rows={5} onChange={(e) => updateEmail(e.target.value, 'body')} defaultValue={emailDraft.body} />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label />
            <Form.Control type="file" />
          </Form.Group>
        </Form>
        <Col>
          <Button type="button" onClick={() => submit('draft')} variant="success">Save Draft</Button>
          <Button type="button" onClick={() => submit('send')} variant="primary" className="mx-3">Send</Button>
        </Col>
      </Row>
    </Container>
  ) : '';
};

export default EditEmailDraft;
