import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Trash } from 'react-bootstrap-icons';
import { Navigate } from 'react-router-dom';

const DraftItem = ({ email }) => {
  const [emailID, setEmailID] = useState('');

  const openEmail = (event, id) => {
    if (event.target.type !== 'checkbox') {
      setEmailID(id);
    }
  };

  if (emailID !== '') {
    return (<Navigate to={`/edit-draft/${emailID}`} />);
  }

  return (
    <tr onClick={(event) => openEmail(event, email._id)}>
      <td style={{ width: '1em' }}><Form.Check /></td>
      <td>{email.subject}</td>
      <td className="d-flex flex-row-reverse">
        <Button variant="danger" size="sm" className="bill-button-spacing">
          <Trash size={15} />
        </Button>
      </td>
    </tr>
  );
};

// Require a document to be passed to this component.
DraftItem.propTypes = {
  email: PropTypes.shape({
    _id: PropTypes.string,
    subject: PropTypes.string,
  }).isRequired,
};

export default DraftItem;
