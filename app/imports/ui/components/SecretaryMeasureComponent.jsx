import React from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Dropdown } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { Pen } from 'react-bootstrap-icons';
import swal from 'sweetalert';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const SecretaryMeasureComponent = ({ measure, userOffice, testimonyAssigner }) => {
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

  const assignTestimony = (user, thisUserOffice, thisMeasure) => {
    console.log(user.email);
    let createAssignedTestimony;
    if (user.assignedTestimony === undefined) {
      createAssignedTestimony = [{
        measureID: thisMeasure._id,
        assigner: testimonyAssigner.email,
        office: thisUserOffice,
        comment: 'test' }];
      console.log(createAssignedTestimony);
    } else {
      user.assignedTestimony.push({
        measureID: thisMeasure._id,
        assigner: testimonyAssigner.email,
        office: thisUserOffice,
        comment: 'test',
      });
    }
    let collectionName;
    if (user.role === ROLE.USER) {
      collectionName = UserProfiles.getCollectionName();
    } else {
      collectionName = AdminProfiles.getCollectionName();
    }

    let updateData;
    if (user.assignedTestimony === undefined) {
      updateData = { id: user._id, assignedTestimony: createAssignedTestimony };
    } else {
      updateData = { id: user._id, assignedTestimony: user.assignedTestimony };
    }
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Folder created', 'success'));
    console.log(user.assignedTestimony);
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
            {_.filter(users, function (user) { return filterWriter(user, userOffice); }).map((user) => <Dropdown.Item onClick={() => assignTestimony(user, userOffice, measure)}>{user.firstName} {user.lastName} ({user.email}) </Dropdown.Item>)}
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
  testimonyAssigner: PropTypes.shape().isRequired,
};

export default SecretaryMeasureComponent;
