import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Button, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Trash } from 'react-bootstrap-icons';
import { Navigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import { Emails } from '../../api/email/EmailCollection';
import { removeItMethod } from '../../api/base/BaseCollection.methods';

const DraftItem = ({ email }) => {
  const [emailID, setEmailID] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const { ready } = useTracker(() => {
    const emailSubscription = Emails.subscribeEmail();
    const rdy = emailSubscription.ready();

    return {
      ready: rdy,
    };
  }, []);

  const openEmail = (event, id) => {
    if (event.target.type !== 'checkbox' && event.target.tagName !== 'svg' && event.target.type !== 'button' && event.target.tagName !== 'path' && event.target.tagName !== 'DIV') {
      setEmailID(id);
    }
  };

  const submitBtn = () => {
    const collectionName = Emails.getCollectionName();
    const instance = email._id;
    removeItMethod.callPromise({ collectionName, instance })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        setShowDelete(false);
        swal('Success', 'Item deleted successfully', 'success');
      });
  };

  if (emailID !== '') {
    return (<Navigate to={`/edit-draft/${emailID}`} />);
  }

  return ready ? (
    <tr onClick={(event) => openEmail(event, email._id)}>
      <td style={{ width: '1em' }}><Form.Check /></td>
      <td>{email.subject}</td>
      <td className="d-flex flex-row-reverse">
        <Button variant="danger" size="sm" className="bill-button-spacing" onClick={() => setShowDelete(true)}>
          <Trash size={15} />
        </Button>
      </td>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered="true">
        <ConfirmationModal modal={{ title: 'Delete Draft', body: 'Are you sure you want to delete this draft?' }} />
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="primary" className="btn btn-success" onClick={submitBtn}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </tr>
  ) : '';
};

// Require a document to be passed to this component.
DraftItem.propTypes = {
  email: PropTypes.shape({
    _id: PropTypes.string,
    subject: PropTypes.string,
  }).isRequired,
};

export default DraftItem;
