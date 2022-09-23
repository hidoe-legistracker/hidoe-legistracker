import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
// import { PAGE_IDS } from '../utilities/PageIDs';

// used https://www.npmjs.com/package/react-to-print
const EmployeeListItem = ({ profile }) => (
  <tr>
    <th scope="row">
      <div className="d-grid gap-2 d-md-block text-center">
        <img src="https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png" className="img-fluid" alt="Profile Pic" width={50} />
      </div>
    </th>
    <td className="text-center align-middle" width={150}>{profile.name}</td>
    <td className="text-center align-middle">{profile.email}</td>
    <td className="text-center align-middle">{profile.employeeID}</td>
    <td className="text-center align-middle">
      <Button variant="info" href={`/profile/${profile.employeeID}`}>View Profile</Button>
    </td>
  </tr>
);

// Require a document to be passed to this component.
EmployeeListItem.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    employeeID: PropTypes.string,
  }).isRequired,
};

export default EmployeeListItem;
