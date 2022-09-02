import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

const ConfirmationModal = ({ modal }) => {
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  return (
    <div>
      <Button variant="success" onClick={modalShow}>
        Launch demo modal
      </Button>
      <Modal show={show} onHide={modalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title centered>{modal.type} Bill</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to {modal.type} this bill?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Require a document to be passed to this component.
ConfirmationModal.propTypes = {
  modal: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
};

export default ConfirmationModal;
