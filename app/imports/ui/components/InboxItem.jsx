import React, { useState } from 'react';
import { Button, Form, Modal, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const InboxItem = ({ email }) => {
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  const openEmail = (event) => {
    if (event.target.type !== 'checkbox' && !show) {
      modalShow();
    }
  };
  return (
    <tr onClick={(event) => openEmail(event)}>
      <td style={{ width: '1em' }}><Form.Check inline /></td>
      <td>{email.from}</td>
      <td>{email.subject}</td>
      <td className="d-flex flex-row-reverse">{(new Date(email.time)).toLocaleDateString()}</td>

      <Modal show={show} onHide={modalClose} centered="true" fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{email.subject}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><h6 style={{ display: 'inline' }}>From: </h6> {email.from}</p>
          <p><h6 style={{ display: 'inline' }}>To: </h6> {email.to}</p>
          {email.cc !== '' ? <p><h6 style={{ display: 'inline' }}>cc: </h6> {email.cc}</p> : ''}
          <hr />
          <h6>Body:</h6>
          <Card>
            <Card.Body style={{ minHeight: '55vh' }}>
              <p>{email.body}</p>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          {email.hasBillReference ? <NavLink to={`/view-bill/${email.billID}`}><Button>View Bill #{email.billNumber}</Button></NavLink> : ''}
          <Button variant="secondary" onClick={modalClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </tr>
  );
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
  }).isRequired,
};

export default InboxItem;
