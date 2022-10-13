import React, { useState } from 'react';
import {
  Container,
  Row,
  ListGroup,
  Col,
  Form,
  Alert,
  DropdownButton,
  Dropdown,
  Button, Accordion, Badge, Modal,
} from 'react-bootstrap';

import { Meteor } from 'meteor/meteor';
import Select from 'react-select';
import swal from 'sweetalert';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Emails } from '../../api/email/EmailCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

/* A simple static component to render some text for the landing page. */
const email = {
  subject: '',
  recipients: [],
  ccs: '',
  bccs: '',
  date: '',
  body: '',
};

const Landing = () => {
  /* Example emails as recipient. */
  let emailSample = [
    {
      label: 'example1@gmail.com',
      value: 'example1@gmail.com',
    },
    {
      label: 'example2@gmail.com',
      value: 'example2@gmail.com',
    },
    {
      label: 'john@gmail.com',
      value: 'john@gmail.com',
    },
  ];
  emailSample = emailSample.map(item => {
    const { name: label, key: value, ...rest } = item;
    return { label, value, ...rest };
  });
  /* Template mail, Modal */
  const [mail, setMail] = useState('Click here');
  const [show, setShow] = useState(false);
  const modalClose = () => { setMail(''); setShow(false); };
  const modalShow = () => setShow(true);
  const updateEmail = (value, property) => {
    email[property] = value;
  };
  const getEmails = (a) => {
    const mails = [];
    a.forEach(function (b) {
      mails.push(b.value);
    });
    updateEmail(mails, 'recipients');
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
  /* Issues with getting multiple emails and updating email according to number of recipients */
  // <Select options={emails} isMulti placeholder="Recipients">Emails</Select>
  // <Form.Control type="body" as="textarea" rows={5} value={mail} onChange={(e) => { setMail(e.target.value); updateEmail(e, 'body'); }} />
  return (
    <Container id={PAGE_IDS.MONITORING_REPORT} className="py-3">
      <Row className="mb-5">
        <Col className="align-left">
          <ListGroup horizontal="sm">
            <ListGroup.Item><strong>Date: </strong> 4/22/2022 </ListGroup.Item>
            <ListGroup.Item><strong>Time: </strong> 3:30 PM </ListGroup.Item>
            <ListGroup.Item><strong>Location: </strong> CR 229 </ListGroup.Item>
            <ListGroup.Item><strong>Committee: </strong> Conference </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
          <Form>
            <Form.Check
              type="radio"
              label="Written Only"
              name="writeOptions"
            />
            <Form.Check
              type="radio"
              label="Written Comments"
              name="writeOptions"
            />
          </Form>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col className="align-center">
          <ListGroup>
            <ListGroup.Item><strong>Department: </strong>Education </ListGroup.Item>
            <ListGroup.Item><strong>Testifier: </strong> Keith T. Hayashi Interim Superintendent of Education </ListGroup.Item>
            <ListGroup.Item><strong>Title of Bill: </strong> SB 2184, SD1, HD1, CD1 Relating to Digital Learning  </ListGroup.Item>
            <ListGroup.Item><strong>Purpose of Bill: </strong> Establishes a Digital Learning Center within the Department of Education.
              Appropriates funds to staff and administer the Digital Learning Center. (CD1)
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row className="mb-5">
        <Form>
          <Form.Group className="mb-2">
            <Form.Check
              type="radio"
              label="Support"
              name="supportOptions"
            />
            <Form.Check
              type="radio"
              label="Oppose"
              name="supportOptions"
            />
            <Form.Check
              type="radio"
              label="Comments"
              name="supportOptions"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              placeholder="Start Testimony Here"
            />
          </Form.Group>
          <Form.Group className="mb-5">
            <Form.Control type="file" className="mb-2" />
            <Alert key="danger" variant="danger">
              <u>Directions:</u> After completing testimony, identify who to route the testimony to in the field below, then click on <u>Route</u> button.
            </Alert>
          </Form.Group>
          <Form.Group className="mb-2">
            <Alert key="primary" variant="primary">
              <u>Comments:</u> (Include date & initials)
            </Alert>
            <Form.Control as="textarea" />
          </Form.Group>
          <Form.Group className="mb-2">
            <strong className="text-primary">Route Testimony to:</strong>
            <DropdownButton drop="end" className="mb-2" title="names">
              <Dropdown.Item>Name 1</Dropdown.Item>
              <Dropdown.Item>Name 2</Dropdown.Item>
              <Dropdown.Item>Name 3</Dropdown.Item>
              <Dropdown.Item>Name 4</Dropdown.Item>
            </DropdownButton>
            <Form.Check label="Testimony same as previous" type="checkbox" clas />
          </Form.Group>
          <Form.Group className="mb-2">
            <Button className="me-2">Route for Office Review</Button>
            <Button variant="secondary">Route to PIPE</Button>
          </Form.Group>
          <Form.Group className="mb-5 text-secondary text-sm">
            Status:
            <Form.Check
              type="radio"
              label="Active"
              name="StatusOptions"
            />
            <Form.Check
              type="radio"
              label="Inactive"
              name="StatusOptions"
            />
            Action: Testimony<br />
            Office: OCID, OITS, OTM, OFS, DEPUTY<br />
            Assigned to: ELB, ELB-DOT<br />
            Action By: CN-Charles Souza/OU-OCID/O*HIDOE*CN-Raymond Fujino/OU-OCID/O*HIDOE<br />
            Secretary: CN-Christol Allen/OU-OCID/O*HIDOE*CN-Saloua Adjir/OU-OCID/O*HIDOE<br />
          </Form.Group>
          <Form.Group>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Review Section</Accordion.Header>
                <Accordion.Body>
                  <Form.Control className="mb-2" as="textarea" placeholder="Comments: This will show on disapproval email notice." />
                  <Button className="me-2">Route to Final Approver</Button>
                  <Button variant="danger">Send back to lead office for additional edits</Button>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Approval Section</Accordion.Header>
                <Accordion.Body className="text-danger">
                  <u>Final Approval Directions</u><br />
                  Review and Edit Testimony as necessary. To reroute back to person change name in <strong>Route testimony to: </strong> field and click on
                  <strong> Save & Route... above.</strong><br />
                  <strong>Final Approval Given</strong> for Supts office below.<br />
                  <Badge bg="primary">Status: New</Badge>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Form.Group>
        </Form>
      </Row>
      <Row className="mb-xl-1">
        <Form>
          <Button variant="primary" onClick={modalShow}>Email</Button>
          <Modal show={show} onHide={modalClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
              <Modal.Title>Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <DropdownButton drop="down" className="mb-2" title="Template Mails">
                <Dropdown.Item onClick={() => { setMail('template1'); updateEmail('template1', 'body'); }}>Template 1</Dropdown.Item>
                <Dropdown.Item onClick={() => { setMail('something something'); updateEmail('something something', 'body'); }}>Template 2</Dropdown.Item>
              </DropdownButton>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Email address</Form.Label>
                  <Select options={emailSample} isMulti placeholder="Recipients" onChange={(e) => { getEmails(e); }} />
                </Form.Group>
                <Form.Group className="cc">
                  <Form.Label>Cc: </Form.Label>
                  <Form.Control type="cc" placeholder="" onChange={(e) => updateEmail(e.target.value, 'ccs')} />
                </Form.Group>
                <Form.Group className="bcc">
                  <Form.Label>Bcc: </Form.Label>
                  <Form.Control type="bcc" placeholder="" onChange={(e) => updateEmail(e.target.value, 'bccs')} />
                </Form.Group>
                <Form.Group className="subject">
                  <Form.Label>Subject: </Form.Label>
                  <Form.Control type="subject" placeholder="" onChange={(e) => updateEmail(e.target.value, 'subject')} />
                </Form.Group>
                <Form.Group className="body">
                  <Form.Label>Body: </Form.Label>
                  <Form.Control type="body" as="textarea" rows={5} value={mail} onChange={(e) => { setMail(e.target.value); updateEmail(e.target.value, 'body'); }} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={modalClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" onClick={() => { submit(); modalClose(); }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </Row>
      <Row className="mb-5">
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item className="text-secondary">Created by: Brandon Lee/OSIP/HIDOE  </ListGroup.Item>
            <ListGroup.Item className="text-secondary">Created on: 08/25/2022 1:48:59</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item>Last Edited By:</ListGroup.Item>
            <ListGroup.Item>Date: 08/25/2022 1:49:00</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;
