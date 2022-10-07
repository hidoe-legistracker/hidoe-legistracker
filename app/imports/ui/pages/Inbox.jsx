import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Row, Col, Form, Nav, Table, Tab } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { PencilSquare, ArrowRepeat, EnvelopeFill, PenFill, Trash3Fill, SendFill } from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Emails } from '../../api/email/EmailCollection';
import InboxItem from '../components/InboxItem';
import SentItem from '../components/SentItem';
import DraftItem from '../components/DraftItem';
import LoadingSpinner from '../components/LoadingSpinner';

const Inbox = () => {
  const { ready, emails, drafts, sent } = useTracker(() => {
    const username = Meteor.user() ? Meteor.user().username : '';
    const emailSubscription = Emails.subscribeEmail();
    const isReady = emailSubscription.ready();
    const emailData = Emails.find({ recipients: username, isDraft: false }, {}).fetch();
    const sentData = Emails.find({ senderEmail: username, isDraft: false }, {}).fetch();
    const draftData = Emails.find({ senderEmail: username, isDraft: true }, {}).fetch();
    return {
      ready: isReady,
      emails: emailData,
      drafts: draftData,
      sent: sentData,
    };
  }, []);

  return (ready ? (
    <Container id={PAGE_IDS.INBOX} className="py-3">
      <Tab.Container defaultActiveKey="inbox">
        <Row className="justify-content-center">
          <Col className="pt-5">
            <Button id={COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON} href="/create-email" variant="primary" size="md">
              COMPOSE
            </Button>
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
                    {emails.map((emailItem, index) => <InboxItem key={index} email={{ _id: emailItem._id, from: emailItem.senderEmail, subject: emailItem.subject, time: emailItem.date.toISOString() }} />)}
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
                    {sent.map((emailItem, index) => <SentItem key={index} email={{ _id: emailItem._id, subject: emailItem.subject, time: emailItem.date.toISOString() }} />)}
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
