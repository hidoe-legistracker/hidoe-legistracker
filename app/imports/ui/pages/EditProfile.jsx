import React from 'react';
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
import { updateMethod } from '../../api/base/BaseCollection.methods';

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

/* Renders the Profile page for viewing your profile. */
const EditProfile = () => {
  const profileCard = { marginTop: '20px', boxShadow: '0.1px 0.1px 5px #cccccc', borderRadius: '0.5em' };

  const { employeeID } = useParams();

  const { validUser, thisUser, user, ready } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();

    let usr = UserProfiles.findOne({ employeeID: employeeID }, {});
    const thisUsr = UserProfiles.findOne({ email: currUser }, {});
    if (usr === undefined) usr = AdminProfiles.findOne({ employeeID: employeeID }, {});
    return {
      validUser: usr !== undefined,
      thisUser: thisUsr,
      user: usr,
      ready: rdy,
    };
  }, [employeeID]);

  let selectedDepartments = [];
  if (ready) {
    selectedDepartments = user.departments;
  }
  const selectDepartments = e => {
    selectedDepartments = e;
  };

  const submit = () => {
    const collectionName = UserProfiles.getCollectionName();
    const updateData = { id: user._id, departments: selectedDepartments, phone: document.getElementById('phone-input').value.toString() };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Profile updated successfully', 'success'));
  };

  if (ready && Roles.userIsInRole(Meteor.userId(), [ROLE.USER]) && thisUser.employeeID !== employeeID) {
    return (<Navigate to={`/profile/${employeeID}`} />);
  }

  // eslint-disable-next-line no-nested-ternary
  return (ready ? (validUser ? (
    <Container id={PAGE_IDS.PROFILE} className="py-3" style={{ marginTop: '50px' }}>
      <Row>
        <Col xs={3}>
          <h1 className="montserrat" style={{ textAlign: 'left', fontSize: '2em' }}>User Profile</h1>
        </Col>
        <Col>
          <hr />
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
                <Button variant="outline-secondary" href={`/profile/${employeeID}`} style={{ marginRight: '0.3em' }}>Return to Profile</Button>
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
                <p><b>Department(s): </b></p>
                <Select id="select-departments" options={committees} isMulti closeMenuOnSelect={false} onChange={selectDepartments} defaultValue={user.departments} />
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
                  <Form.Control
                    id="phone-input"
                    placeholder="(xxx) xxx-xxxx"
                    aria-label="Phone"
                    defaultValue={user.phone ? user.phone : ''}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
  ) :
    <h1>User does not exist</h1>
  ) : '');
};

export default EditProfile;
