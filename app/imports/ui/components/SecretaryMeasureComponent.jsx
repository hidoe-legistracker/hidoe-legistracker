import React from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Dropdown } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { Pen } from 'react-bootstrap-icons';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

const SecretaryMeasureComponent = ({ measure, userOffice }) => {
  const { ready, users } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();

    let usr = UserProfiles.findOne({ email: currUser });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: currUser });
    }

    const usrs = _.sortBy(UserProfiles.find({}, { }).fetch().concat(AdminProfiles.find({}, {}).fetch()), (obj) => obj.lastName);

    return {
      users: usrs,
      ready: rdy,
    };
  });

  const filterWriter = (user, office) => {
    if (_.contains(user.offices, office) && user.position === 'Testimony Writer') {
      return user;
    }
    return '';
  };

  return ready ? (
    <tr>
      <Link className="d-lg-table-cell link-dark" as={NavLink} exact to={`/view-bill/${measure._id}`}>{measure.measureNumber}</Link>
      <Link className="d-table-cell link-dark" as={NavLink} exact to={`/view-bill/${measure._id}`}>{measure.measureTitle}</Link>
      <Link className="d-table-cell link-dark" as={NavLink} exact to={`/view-bill/${measure._id}`}>{measure.description}</Link>
      <Link className="d-table-cell link-dark" as={NavLink} exact to={`/view-bill/${measure._id}`}>{measure.mainOfficeType}</Link>
      <Link className="d-table-cell link-dark" as={NavLink} exact to={`/view-bill/${measure._id}`}>{measure.measureType}</Link>
      <td>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <Pen style={{ marginRight: '0.5em', marginTop: '-5px' }} />
            Assign
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>{userOffice} Testimony Writers</Dropdown.Header>
            <Dropdown.Divider />
            {_.filter(users, function (user) { return filterWriter(user, userOffice); }).map((user) => <Dropdown.Item>{user.firstName} {user.lastName} ({user.email}) </Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  ) : '';
};

// Require a document to be passed to this component.
SecretaryMeasureComponent.propTypes = {
  measure: PropTypes.shape().isRequired,
  userOffice: PropTypes.string.isRequired,
};

export default SecretaryMeasureComponent;
