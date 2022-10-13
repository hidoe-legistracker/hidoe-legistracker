import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Button, Col, Container, DropdownButton, Dropdown, Form, Modal, Nav, Row, Tab, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { EnvelopeFill, PenFill, SendFill } from 'react-bootstrap-icons';
import swal from 'sweetalert';
import Select from 'react-select';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Emails } from '../../api/email/EmailCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import InboxItem from '../components/InboxItem';
import SentItem from '../components/SentItem';
import DraftItem from '../components/DraftItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const newEmail = {
  subject: '',
  recipients: [],
  ccs: [],
  bccs: [],
  date: '',
  body: '',
};

const Inbox = () => {
  const { thisUser, users, ready, emails, drafts, sent, measures } = useTracker(() => {
    const username = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const emailSubscription = Emails.subscribeEmail();
    const measureSubscription = Measures.subscribeMeasures();
    const isReady = emailSubscription.ready() && measureSubscription.ready() && userSubscription.ready() && adminSubscription.ready();
    const emailData = Emails.find({ recipients: username, isDraft: false }, {}).fetch();
    const ccData = Emails.find({ ccs: username, isDraft: false }, {}).fetch();
    const bccData = Emails.find({ bccs: username, isDraft: false }, {}).fetch();
    const sentData = Emails.find({ senderEmail: username, isDraft: false }, {}).fetch();
    const draftData = Emails.find({ senderEmail: username, isDraft: true }, {}).fetch();
    const measureData = Measures.find({}, {}).fetch();

    const usrs = _.sortBy(UserProfiles.find({}, { }).fetch().concat(AdminProfiles.find({}, {}).fetch()), (obj) => obj.lastName);
    const formattedUsers = [];
    usrs.forEach(user => {
      formattedUsers.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
    });

    let thisUsr = UserProfiles.findOne({ email: username }, {});
    if (thisUsr === undefined) thisUsr = AdminProfiles.findOne({ email: username }, {});

    ccData.forEach(data => {
      if (!_.contains(_.pluck(emailData, '_id'), data._id)) {
        emailData.push(data);
      }
    });
    bccData.forEach(data => {
      if (!_.contains(_.pluck(emailData, '_id'), data._id)) {
        emailData.push(data);
      }
    });
    return {
      ready: isReady,
      emails: emailData,
      drafts: draftData,
      sent: sentData,
      measures: measureData,
      thisUser: thisUsr,
      users: formattedUsers,
    };
  }, []);
  const offices = [
    { label: 'OCID', value: 'example-list1@mail.com' },
    { label: 'OFO', value: 'example-list2@mail.com' },
    { label: 'OFS', value: 'example-list3@mail.com' },
    { label: 'OHE', value: 'example-list4@mail.com' },
    { label: 'OITS', value: 'example-list5@mail.com' },
    { label: 'OSIP', value: 'example-list6@mail.com' },
    { label: 'OSSS', value: 'example-list7@mail.com' },
    { label: 'OTM', value: 'example-list8@mail.com' },
  ];
  const sampleMail = [
    'Sample 1',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
    'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco ' +
    'laboris nisi ut aliquip ex ea commodo consequat.',
  ];

  const [show, setShow] = useState(false);
  const [mail, setMail] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateEmail = (event, property) => {
    newEmail[property] = event;
  };

  // On submit, insert the data.
  const submit = (type) => {
    const { subject, body } = newEmail;
    const recipients = [];
    const ccs = [];
    const bccs = [];
    setShow(false);
    if (subject === '' || newEmail.recipients.length === 0 || body === '') {
      return;
    }

    newEmail.recipients.forEach(recipient => {
      recipients.push(recipient.value);
    });
    newEmail.ccs.forEach(cc => {
      ccs.push(cc.value);
    });
    newEmail.bccs.forEach(bcc => {
      bccs.push(bcc.value);
    });

    const senderEmail = thisUser.email;
    const senderName = `${thisUser.firstName} ${thisUser.lastName}`;
    const date = new Date(); // new Date(new Date().toLocaleDateString()).toISOString().substring(0, 10);
    const collectionName = Emails.getCollectionName();
    const definitionData = { subject, senderName, senderEmail, recipients, ccs, bccs, date, body, isDraft: type === 'draft' };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        if (type === 'draft') {
          swal('Draft Saved', '', 'success');
        } else {
          swal('Success', 'Email Sent!', 'success');
        }
      });
  };

  // Get bill number from subject field
  function getBillNumber(subjectField) {
    const string = String(subjectField.toLowerCase().match(/bill.*[0-9]+/));
    return Number(string.match(/[0-9]+/));
  }
  // Get bill number from subject field. Search measures for document with matching bill number. Return _id
  function getBillID(subjectField) {
    const billNumber = getBillNumber(subjectField);
    const index = measures.map(function (measure) { return measure.measureNumber; }).indexOf(billNumber);
    if (index !== -1) {
      return measures[index]._id;
    }
    return '';
  }
  // Check if subject field contains the keyword 'bill' followed by a number
  function checkEmailItem(subjectField) {
    return !!subjectField.toLowerCase().match(/bill.*[0-9]+/);
  }

  return (ready ? (
    <Container id={PAGE_IDS.INBOX} className="py-3">
      <Tab.Container defaultActiveKey="inbox">
        <Row className="justify-content-center">
          <Col className="pt-5">
            <Button id={COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON} size="md" variant="primary" onClick={() => { handleShow(); }}>
              COMPOSE
            </Button>
            <Modal
              id={COMPONENT_IDS.INBOX_CREATE_EMAIL_MODAL}
              show={show}
              onHide={() => { handleClose(); setMail(''); }}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>New Message</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <DropdownButton drop="down" title="Template Mails">
                    <Dropdown.Item onClick={() => { setMail(sampleMail[0]); updateEmail(sampleMail[0], 'body'); }}>Template 1</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setMail(sampleMail[1]); updateEmail(sampleMail[1], 'body'); }}>Template 2</Dropdown.Item>
                  </DropdownButton>
                  <Form.Group classname="offices">
                    <Form.Label>Offices: </Form.Label>
                    <Select id="email-to" options={offices} isMulti closeMenuOnSelect={false} onChange={(e) => updateEmail(e, 'recipients')} />
                  </Form.Group>
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
                    <Form.Control type="body" as="textarea" value={mail} rows={5} onChange={(e) => { setMail(e.target.value); updateEmail(e.target.value, 'body'); }} />
                  </Form.Group>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label />
                    <Form.Control type="file" />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button type="button" onClick={() => { submit('draft'); setMail(''); }} variant="success">Save Draft</Button>
                <Button type="button" onClick={() => { submit('send'); setMail(''); }} variant="primary" className="mx-3">Send</Button>
              </Modal.Footer>
            </Modal>
            <Nav variant="pills" className="flex-column mt-4">
              <Nav.Link eventKey="inbox"><EnvelopeFill size={20} /> Inbox</Nav.Link>
              <Nav.Link eventKey="drafts"><PenFill size={20} /> Drafts</Nav.Link>
              <Nav.Link eventKey="sent"><SendFill size={20} /> Sent</Nav.Link>
            </Nav>
          </Col>
          <Col xs={10}>
            <Tab.Content>
              <Tab.Pane eventKey="inbox">
                <h1 className="text-center montserrat">INBOX</h1>
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col"><Form.Check inline /> </th>
                      <th scope="col">Sender</th>
                      <th scope="col">Subject</th>
                      <th scope="col" className="d-flex flex-row-reverse">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* eslint-disable-next-line max-len */}
                    {emails.map((emailItem, index) => <InboxItem key={index} email={{ _id: emailItem._id, from: emailItem.senderEmail, to: emailItem.recipients.toString(), cc: emailItem.ccs.toString(), subject: emailItem.subject, body: emailItem.body, time: emailItem.date.toISOString(), hasBillReference: checkEmailItem(emailItem.subject), billNumber: getBillNumber(emailItem.subject), billID: getBillID(emailItem.subject) }} />)}
                  </tbody>
                </Table>
              </Tab.Pane>
              <Tab.Pane eventKey="drafts">
                <h1 className="text-center montserrat">DRAFTS</h1>
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col"><Form.Check inline /> </th>
                      <th scope="col">Subject</th>
                      <th scope="col"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {drafts.map((emailItem, index) => <DraftItem key={index} email={{ _id: emailItem._id, subject: emailItem.subject }} />)}
                  </tbody>
                </Table>
              </Tab.Pane>
              <Tab.Pane eventKey="sent">
                <h1 className="text-center montserrat">SENT</h1>
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col"><Form.Check inline /> </th>
                      <th scope="col">Subject</th>
                      <th scope="col" className="d-flex flex-row-reverse">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* eslint-disable-next-line max-len */}
                    {sent.map((emailItem, index) => <SentItem key={index} email={{ _id: emailItem._id, subject: emailItem.subject, to: emailItem.recipients.toString(), cc: emailItem.ccs.toString(), bcc: emailItem.bccs.toString(), body: emailItem.body, time: emailItem.date.toISOString() }} />)}
                  </tbody>
                </Table>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  ) : <LoadingSpinner message="Loading Notifications" />);
};

export default Inbox;
