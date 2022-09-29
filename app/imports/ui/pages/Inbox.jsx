import React from 'react';
import { Button, Container, Row, Col, Form, Nav } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { PencilSquare, ArrowRepeat, EnvelopeFill, PenFill, Trash3Fill, SendFill } from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Emails } from '../../api/email/EmailCollection';
import ItemEmail from './ItemEmail';
import LoadingSpinner from '../components/LoadingSpinner';

const Inbox = () => {
  const { ready, email } = useTracker(() => {
    const subscription = Emails.subscribeEmail();
    const isReady = subscription.ready();
    const emailData = Emails.find({}, {}).fetch();
    return {
      ready: isReady,
      email: emailData,
    };
  }, []);

  return (ready ? (
    <Container id={PAGE_IDS.INBOX} className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Row>
            <h1> </h1>
            <h1> </h1>
            <h1> </h1>
            <h1> </h1>
            <h1> </h1>
          </Row>
          <div>
            <Button id={COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON} href="/create-email" variant="primary" size="md" style={{ marginTop: 10 }}>
              COMPOSE
            </Button>
          </div>
          <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link eventKey="link-1"><EnvelopeFill size={20} /> Messages</Nav.Link>
            <Nav.Link eventKey="link-2"><Trash3Fill size={20} /> Deleted</Nav.Link>
            <Nav.Link eventKey="link-3"><PenFill size={20} /> Drafts</Nav.Link>
            <Nav.Link eventKey="link-4"><SendFill size={20} /> Sent</Nav.Link>
          </Nav>
        </Col>
        <Col xs={10}>
          <Row>
            <div>
              <Button variant="secondary" size="sm" style={{ marginTop: 10 }}>
                <Form>
                  <Form.Check inline />
                  SELECT ALL
                </Form>
              </Button>{' '}
              <Button id={COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON} href="/create-email" variant="secondary" size="sm" style={{ marginTop: 10 }}>
                <PencilSquare size={15} />
              </Button>{' '}
              <Button variant="secondary" size="sm" style={{ marginTop: 10 }}>
                <ArrowRepeat size={15} />
              </Button>{' '}
            </div>
            <div>
              <h3 align="center">INBOX</h3>
            </div>
            <ItemEmail key={email._id} email={email} Emails={Emails} />
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Notifications" />);
};
// {email.map((emails) => <ItemEmail key={emails._id} email={emails} Emails={Emails} />)}
/**
 * // Require an array of email documents in the props.
 Inbox.propTypes = {
  emails: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};
 // withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Contacts documents.
  const subscription = Meteor.subscribe(Emails.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Contacts documents
  const emails = Emails.collection.find({}).fetch();
  return {
    emails,
    ready,
  };
})(Inbox);
* */
export default Inbox;
