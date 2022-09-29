import React from 'react';
import { Button, Container, Row, Col, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { PencilSquare } from 'react-bootstrap-icons';
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
        <Col xs={10}>
          <Row>
            <div>
              <Button id={COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON} href="/create-email" variant="secondary" size="md" style={{ marginTop: 10 }}>
                <PencilSquare size={15} />
              </Button>{' '}
            </div>
            <div>
              <h3 align="center">Bill Updates</h3>
            </div>
            <Table>
              <thead>
                <tr>
                  <th scope="col">Select</th>
                  <th scope="col">Date</th>
                  <th scope="col">Sender</th>
                  <th scope="col">Subject</th>
                </tr>
              </thead>
              <tbody style={{ marginTop: 5, paddingTop: 5 }}>
                <td>
                  {email.map((emails) => <ItemEmail key={emails._id} email={emails} Emails={Emails} />)}
                </td>
              </tbody>
            </Table>
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Notifications" />);
};

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
