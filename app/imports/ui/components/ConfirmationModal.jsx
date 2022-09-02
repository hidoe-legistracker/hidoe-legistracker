import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

const ConfirmationModal = ({ modal }) => {
  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title centered>{modal.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{modal.body}</p>
      </Modal.Body>
    </div>
  );
};

// Require a document to be passed to this component.
ConfirmationModal.propTypes = {
  modal: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
};

export default ConfirmationModal;
