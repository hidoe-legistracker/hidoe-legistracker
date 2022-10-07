import React from 'react';
import { Button, Form, Row, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Trash } from 'react-bootstrap-icons';
import { Emails } from '../../api/email/EmailCollection';
// import { PAGE_IDS } from '../utilities/PageIDs';

// used https://www.npmjs.com/package/react-to-print
const SentItem = ({ email }) => {
  const openEmail = (event, emailID) => {
    if (event.target.type === 'checkbox') {
      return;
    }
    console.log(emailID);
  };
  return (
    <tr onClick={(event) => openEmail(event, email._id)}>
      <td style={{ width: '1em' }}><Form.Check inline /></td>
      <td>{email.subject}</td>
      <td className="d-flex flex-row-reverse">{(new Date(email.time)).toLocaleDateString()}</td>
    </tr>
  );
};

// Require a document to be passed to this component.
SentItem.propTypes = {
  email: PropTypes.shape({
    _id: PropTypes.string,
    subject: PropTypes.string,
    time: PropTypes.string,
  }).isRequired,
};

export default SentItem;
