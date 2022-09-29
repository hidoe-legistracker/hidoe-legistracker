import React from 'react';
import { Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Trash } from 'react-bootstrap-icons';
import { Emails } from '../../api/email/EmailCollection';

/** Renders a single email row in the Inbox. See pages/Inbox.jsx. */
class ItemEmail extends React.Component {

  removeEmail(docID) {
    Emails.collection.remove(docID);
  }

  render() {
    const { email } = this.props;
    return (
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>{email.date}</td>
            <td>{email.senderName}</td>
            <td>
              <Link className="table-row" to="/view-bill">
                {email.subject}
              </Link>
            </td>
            <td>
              <Button size="sm" className="bill-button-spacing">
                Mark as Read
              </Button>
            </td>
            <td>
              <Button onClick={() => this.removeEmail(email._id)} variant="danger" size="sm" className="bill-button-spacing">
                <Trash size={15} />
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

// Require a document to be passed to this component.
ItemEmail.propTypes = {
  email: PropTypes.shape({
    senderName: PropTypes.string,
    subject: PropTypes.string,
    date: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
  Emails: PropTypes.shape({}).isRequired,
};

export default ItemEmail;
