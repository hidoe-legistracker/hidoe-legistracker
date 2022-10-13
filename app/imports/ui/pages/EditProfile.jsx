import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { Roles } from 'meteor/alanning:roles';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Navigate } from 'react-router-dom';
import { Col, Container, Row, Button, InputGroup, Form } from 'react-bootstrap';
import Select from 'react-select';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { houseCommittees, senateCommittees } from '../../api/legislature/committees';
import { ROLE } from '../../api/role/Role';
import { defineMethod, updateMethod, transferItMethod } from '../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const house = [];
const senate = [];
Object.values(houseCommittees).forEach(function (committee) {
  house.push({ label: `${committee.name}`, value: `${committee.key}`, group: 'HOUSE' });
});
Object.values(senateCommittees).forEach(function (committee) {
  senate.push({ label: `${committee.name}`, value: `${committee.key}`, group: 'SENATE' });
});
const committees = [{
  label: 'House',
  options: house,
}, {
  label: 'Senate',
  options: senate,
}];

const officeNames = ['OCID', 'OFO', 'OFS', 'OHE', 'OITS', 'OSIP', 'OSSS', 'OTM'];
const offices = [];
officeNames.forEach((name) => {
  offices.push({ label: name, value: name });
});

/* Renders the Profile page for viewing your profile. */
const EditProfile = () => {
  const [newID, setNewID] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const profileCard = { marginTop: '20px', boxShadow: '0.1px 0.1px 5px #cccccc', borderRadius: '0.5em' };

  const { _id } = useParams();

  const { validUser, thisUser, user, ready } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();

    let usr = UserProfiles.findOne({ _id: _id }, {});
    const thisUsr = UserProfiles.findOne({ email: currUser }, {});
    if (usr === undefined) usr = AdminProfiles.findOne({ _id: _id }, {});
    return {
      validUser: usr !== undefined,
      thisUser: thisUsr,
      user: usr,
      ready: rdy,
    };
  }, [_id]);

  let selectedCommittees = [];
  let selectedOffices = [];
  let defaultSelectedOffices = [];
  if (ready) {
    selectedCommittees = user.committees;
    selectedOffices = user.offices;
    user.offices.forEach((office) => {
      defaultSelectedOffices.push({ label: office, value: office });
    });
  }
  const selectCommittees = e => {
    selectedCommittees = e;
  };
  const selectOffices = e => {
    selectedOffices = [];
    e.forEach((x) => {
      selectedOffices.push(x.value);
    });
  };

  const submit = () => {
    const role = document.getElementById(COMPONENT_IDS.EDIT_PROFILE_FORM_ROLE) ? document.getElementById(COMPONENT_IDS.EDIT_PROFILE_FORM_ROLE).value : user.role;
    const phone = document.getElementById(COMPONENT_IDS.EDIT_PROFILE_FORM_PHONE).value.toString();

    if (role !== user.role) {
      const definitionData = _.clone(user);
      definitionData.committees = selectedCommittees;
      definitionData.offices = selectedOffices;
      definitionData.phone = phone;
      definitionData.role = role;

      if (role === ROLE.USER) {
        const collectionName = UserProfiles.getCollectionName();
        // create the new UserProfile
        defineMethod.callPromise({ collectionName, definitionData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => {
            setNewID(UserProfiles.findOne({ email: user.email }, {})._id);
          });
      } else {
        const collectionName = AdminProfiles.getCollectionName();
        // create the new AdminProfile
        defineMethod.callPromise({ collectionName, definitionData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => {
            setNewID(AdminProfiles.findOne({ email: user.email }, {})._id);
          });
      }
      setRedirectToRef(true);
    } else {
      let collectionName;
      if (user.role === ROLE.USER) {
        collectionName = UserProfiles.getCollectionName();
      } else {
        collectionName = AdminProfiles.getCollectionName();
      }
      const updateData = { id: user._id, committees: selectedCommittees, offices: selectedOffices, phone: phone, role: role };
      updateMethod.callPromise({ collectionName, updateData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => swal('Success', 'Profile updated successfully', 'success'));
    }
  };

  if (ready && Roles.userIsInRole(Meteor.userId(), [ROLE.USER]) && thisUser._id !== _id) {
    return (<Navigate to={`/profile/${_id}`} />);
  }

  if (ready && newID !== '' && redirectToReferer) {
    const instance = _id;
    if (user.role === ROLE.USER) {
      const collectionName = UserProfiles.getCollectionName();
      transferItMethod.callPromise({ collectionName, instance })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', 'Profile updated successfully (with role change)', 'success');
        });
    } else {
      const collectionName = AdminProfiles.getCollectionName();
      transferItMethod.callPromise({ collectionName, instance })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', 'Profile updated successfully (with role change)', 'success');
        });
    }
    return (<Navigate to={`/profile/${newID}`} />);
  }

  // eslint-disable-next-line no-nested-ternary
  return (ready ? (validUser ? (
    <Container id={PAGE_IDS.PROFILE} className="py-3" style={{ marginTop: '50px' }}>
      <Row>
        <Col>
          <h1 className="montserrat" style={{ textAlign: 'left', fontSize: '2em' }}>Edit Profile</h1>
        </Col>
      </Row>

      <Row style={profileCard}>
        <Col className="text-center" sm={4} style={{ paddingTop: '5em', paddingBottom: '5em', backgroundColor: 'whitesmoke' }}>
          <img className="img-fluid" src="https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png" alt={`${user.firstName} ${user.lastName} Profile`} width={120} />
          <h4 style={{ marginTop: '1.5em' }}>{`${user.firstName} ${user.lastName}`}</h4>
        </Col>
        <Col style={{ paddingTop: '2em' }}>
          <Row>
            <Row>
              <Col>
                <p><b>Employee ID: </b>{user.employeeID}</p>
              </Col>
              <Col style={{ textAlign: 'right' }}>
                <Button variant="outline-secondary" href={`/profile/${_id}`} style={{ marginRight: '0.3em' }}>Return to Profile</Button>
                <Button variant="success" onClick={submit}>Save</Button>
              </Col>
            </Row>
          </Row>
          <Row>
            <Row>
              <h5 style={{ color: 'gray' }}>Employee Information</h5>
              <hr />
            </Row>
            <Row>
              <Col>
                <Form.Label><b>Office(s): </b></Form.Label>
                <Select id={COMPONENT_IDS.EDIT_PROFILE_FORM_OFFICES} options={offices} isMulti closeMenuOnSelect={false} onChange={selectOffices} defaultValue={defaultSelectedOffices} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label><b>Committee(s): </b></Form.Label>
                <Select id={COMPONENT_IDS.EDIT_PROFILE_FORM_COMMITTEES} options={committees} isMulti closeMenuOnSelect={false} onChange={selectCommittees} defaultValue={selectedCommittees} />
              </Col>
            </Row>
          </Row>
          <Row>
            <Row>
              <h5 style={{ color: 'gray' }}>Contact Information</h5>
              <hr />
            </Row>
            <Row>
              <Col>
                <p><b>Email: </b>{user.email}</p>
              </Col>
              <Col>
                <InputGroup size="sm">
                  <InputGroup.Text><b>Phone</b></InputGroup.Text>
                  <Form.Control id={COMPONENT_IDS.EDIT_PROFILE_FORM_PHONE} placeholder="(xxx) xxx-xxxx" aria-label="Phone" defaultValue={user.phone ? user.phone : ''} />
                </InputGroup>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>

      {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? ([
        <Row style={{ marginTop: '3em' }}>
          <Col>
            <h1 className="montserrat" style={{ textAlign: 'left', fontSize: '2em' }}>Administrator Permissions</h1>
          </Col>
        </Row>,
        <Row>
          <Col xs={3}>
            <Form.Select id={COMPONENT_IDS.EDIT_PROFILE_FORM_ROLE} aria-label="Role Select" defaultValue={user.role}>
              <option disabled>Select User Role</option>
              <option value={ROLE.USER}>{ROLE.USER}</option>
              <option value={ROLE.ADMIN}>{ROLE.ADMIN}</option>
            </Form.Select>
          </Col>
        </Row>,
      ]) : ''}
    </Container>
  ) :
    <h1>User does not exist</h1>
  ) : '');
};

export default EditProfile;
