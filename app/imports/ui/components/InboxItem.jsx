import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Form, Modal, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Emails } from '../../api/email/EmailCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const InboxItem = ({ email }) => {
  const username = Meteor.user() ? Meteor.user().username : '';

  const [show, setShow] = useState(false);
  let emailRead = _.contains(email.isRead, username);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  const { ready } = useTracker(() => {
    const subscription = Emails.subscribeEmail();
    const rdy = subscription.ready();
    return {
      ready: rdy,
    };
  }, []);

  const openEmail = (event) => {
    if (username !== '' && !_.contains(email.isRead, username)) {
      const collectionName = Emails.getCollectionName();
      const newIsRead = email.isRead;
      newIsRead.push(username);
      const updateData = { id: email._id, isRead: newIsRead };
      updateMethod.callPromise({ collectionName, updateData });
      emailRead = false;
    }
    if (event.target.type !== 'checkbox' && !show) {
      modalShow();
    }
  };
  return ready ? (
    <tr onClick={(event) => openEmail(event)} style={!emailRead ? { backgroundColor: 'lightgray' } : {}}>
      <td style={{ width: '1em' }}><Form.Check inline /></td>
      <td>{email.from}</td>
      <td>{email.subject}</td>
      <td className="d-flex flex-row-reverse">{(new Date(email.time)).toLocaleDateString()}</td>

      <Modal show={show} onHide={modalClose} centered="true" fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{email.subject}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><b style={{ display: 'inline' }}>From: </b> {email.from}</p>
          <p><b style={{ display: 'inline' }}>To: </b> {email.to}</p>
          {email.cc !== '' ? <p><b style={{ display: 'inline' }}>cc: </b> {email.cc}</p> : ''}
          <hr />
          <b>Body:</b>
          <Card>
            <Card.Body style={{ minHeight: '55vh' }}>
              <p>{email.body}</p>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          {email.hasBillReference ? <NavLink to={`/view-bill/${email.billID}`} target="_blank"><Button>View Bill #{email.billNumber}</Button></NavLink> : ''}
          <Button variant="secondary" onClick={modalClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </tr>
  ) : '';
};

// Require a document to be passed to this component.
InboxItem.propTypes = {
  email: PropTypes.shape({
    _id: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    cc: PropTypes.string,
    subject: PropTypes.string,
    body: PropTypes.string,
    time: PropTypes.string,
    hasBillReference: PropTypes.bool,
    billNumber: PropTypes.number,
    billID: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    isRead: PropTypes.array,
  }).isRequired,
};

export default InboxItem;
