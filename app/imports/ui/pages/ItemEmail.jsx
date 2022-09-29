import React from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import { Trash } from 'react-bootstrap-icons';
import { Emails } from '../../api/email/EmailCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { Measures } from '../../api/measure/MeasureCollection';

/** Renders a single email row in the Inbox. See pages/Inbox.jsx. */
const ItemEmail = () => {
  const { ready, email } = useTracker(() => {
    const subscription = Measures.subscribeMeasures();
    const isReady = subscription.ready();
    // const measureData = Measures.find({}, {}).fetch();
    const emailData = Emails.find({}, {}).fetch();
    return {
      ready: isReady,
      email: emailData,
    };
  }, []);
  return (ready ? (
    <Table hover>
      <thead>
        <tr>
          <th scope="col">Select</th>
          <th scope="col">Date</th>
          <th scope="col">Sender</th>
          <th scope="col">Subject</th>
          <th scope="col">Mark as Read</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Form>
              <Form.Check inline />
            </Form>
          </td>
          <td>09/29/2022</td>
          <td>john@foo.com</td>
          <td>
            ASSIGNED BILL
          </td>
          <td>
            <Button size="sm" className="bill-button-spacing">
              Mark as Read
            </Button>
          </td>
          <td>
            <Button variant="danger" size="sm" className="bill-button-spacing">
              <Trash size={15} />
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <Form>
              <Form.Check inline />
            </Form>
          </td>
          <td>09/25/2022</td>
          <td>lisa@foo.com</td>
          <td>
            ASSIGNED BILL
          </td>
          <td>
            <Button size="sm" className="bill-button-spacing">
              Mark as Read
            </Button>
          </td>
          <td>
            <Button variant="danger" size="sm" className="bill-button-spacing">
              <Trash size={15} />
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <Form>
              <Form.Check inline />
            </Form>
          </td>
          <td>09/22/2022</td>
          <td>larry@foo.com</td>
          <td>
            ASSIGNED BILL
          </td>
          <td>
            <Button size="sm" className="bill-button-spacing">
              Mark as Read
            </Button>
          </td>
          <td>
            <Button variant="danger" size="sm" className="bill-button-spacing">
              <Trash size={15} />
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <Form>
              <Form.Check inline />
            </Form>
          </td>
          <td>{email.date}</td>
          <td>{email.senderEmail}</td>
          <td>
            {email.subject}
          </td>
          <td>
            <Button size="sm" className="bill-button-spacing">
              Mark as Read
            </Button>
          </td>
          <td>
            <Button onClick={() => Emails.collection.remove(email._id)} variant="danger" size="sm" className="bill-button-spacing">
              <Trash size={15} />
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  ) : <LoadingSpinner message="Loading Notifications" />);
};

// Require a document to be passed to this component.
ItemEmail.propTypes = {
  email: PropTypes.shape({
    senderEmail: PropTypes.string,
    subject: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  }).isRequired,
  Emails: PropTypes.shape({}).isRequired,
};

export default ItemEmail;
