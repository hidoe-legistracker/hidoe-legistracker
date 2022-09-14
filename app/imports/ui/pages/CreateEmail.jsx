import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { PAGE_IDS } from '../utilities/PageIDs';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Emails } from '../../api/email/EmailCollection';

/* Renders the CreateEmail page for composing emails. */
const CreateEmail = () => {

  const email = {
    subject: '',
    recipients: '',
    ccs: '',
    bccs: '',
    date: '',
    body: '',
  };

  const updateEmail = (event, property) => {
    email[property] = event.target.value;
  };

  // On submit, insert the data.
  const submit = () => {
    const { subject, body } = email;
    const ccs = [];
    const bccs = [];
    // TODO: Change when create email page can accept dynamic emails
    const recipients = [
      { name: 'john foo', email: 'john@foo.com' },
      { name: 'bob test', email: 'bob@test.com' },
    ];

    if (subject === '' || email.recipients === '' || email.ccs === '' || email.bccs === '' || body === '') {
      return;
    }
    console.log(Meteor.user());
    const senderEmail = Meteor.user().username;
    const senderName = Meteor.user().firstName + Meteor.user().lastName; // TODO: Fetch profiles collection to get first and last name
    const date = new Date(); // new Date(new Date().toLocaleDateString()).toISOString().substring(0, 10);
    const collectionName = Emails.getCollectionName();
    const definitionData = { subject, senderName, senderEmail, recipients, ccs, bccs, date, body };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Email Sent!', 'success');
      });
  };

  return (
    <Container id={PAGE_IDS.CREATE_EMAIL} className="py-3">
      <Row className="justify-content-center">
        <h1>Create Email</h1>
        <Container>
          <Row>
            <Col>
              <Button href="/" variant="secondary" size="sm">Address</Button>{' '}
              <Button href="/" variant="secondary" size="sm">Check Names</Button>{' '}
            </Col>
          </Row>
        </Container>
        <Container>
          <hr />
        </Container>
        <Form>
          <Form.Group className="to">
            <Form.Label>To: *</Form.Label>
            <Form.Control type="to" placeholder="" onChange={(e) => updateEmail(e, 'recipients')} />
          </Form.Group>
          <Form.Group className="cc">
            <Form.Label>Cc: </Form.Label>
            <Form.Control type="cc" placeholder="" onChange={(e) => updateEmail(e, 'ccs')} />
          </Form.Group>
          <Form.Group className="bcc">
            <Form.Label>Bcc: </Form.Label>
            <Form.Control type="bcc" placeholder="" onChange={(e) => updateEmail(e, 'bccs')} />
          </Form.Group>
          <Form.Group className="from">
            <Form.Label>From: </Form.Label>
            <Form.Control plaintext readOnly defaultValue="john foo/OSIP/HIDOE" />
          </Form.Group>
        </Form>
        <Container>
          <hr />
        </Container>
        <Form>
          <Form.Group className="subject">
            <Form.Label>Subject: </Form.Label>
            <Form.Control type="subject" placeholder="" onChange={(e) => updateEmail(e, 'subject')} />
          </Form.Group>
          <Form.Group className="body">
            <Form.Label> </Form.Label>
            <Form.Control type="body" as="textarea" rows={5} onChange={(e) => updateEmail(e, 'body')} />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label />
            <Form.Control type="file" />
          </Form.Group>
        </Form>
        <Col>
          <Button type="submit" onClick={submit} variant="primary" size="lg">Send</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateEmail;
