import React from 'react';
import PropTypes from 'prop-types';
import { Button, ProgressBar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import {AdminProfiles} from "../../api/user/AdminProfileCollection";
import _ from "lodash";
// import { PAGE_IDS } from '../utilities/PageIDs';

/* Component for layout out a Measures */
const MeasureComponent = ({ measure }) => (
  <Link className="table-row" as={NavLink} exact to={`/view-bill/${measure._id}`}>
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

MeasureComponent.propTypes = {
  measure: PropTypes.shape().isRequired,
};

const Folder = () => (
  <ListGroup defaultActiveKey="#link1">
    <ListGroup.Item action onClick={() => filter(o)}>{o}</ListGroup.Item>)}
  </ListGroup>
);



// Require a document to be passed to this component.
Folder.propTypes = {
  folder: PropTypes.shape({
    measuresNums: PropTypes.number,
  }).isRequired,
};

export default Folder;
