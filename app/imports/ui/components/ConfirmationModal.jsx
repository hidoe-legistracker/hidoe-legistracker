import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ConfirmationModal = ({ type }) => (
  <tr>
    <td>{type.name}</td>
  </tr>
);

// Require a document to be passed to this component.
ConfirmationModal.propTypes = {
  type: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default ConfirmationModal;
