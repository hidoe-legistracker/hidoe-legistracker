import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const billProgress = 60;

// used https://www.npmjs.com/package/react-to-print
const Measure = ({ measure }) => (
  <Link className="table-row" to="/view-bill">
    <th scope="row">{measure.measureNumber}</th>
    <td>{measure.measureTitle}</td>
    <td>{measure.description}</td>
    <td>{measure.currentReferral}</td>
    <td>{measure.measureType}</td>
    <td>
      <ProgressBar now={billProgress} label={`${billProgress}`} visuallyHidden />
    </td>
  </Link>
);

Measure.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  measure: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default (Measure);
