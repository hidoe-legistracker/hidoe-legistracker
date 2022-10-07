import React from 'react';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';

/* Renders the Profile page for viewing your profile. */
const Profile = () => {
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
                {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) || thisUser._id === _id ? (
                  <Button href={`/edit-profile/${_id}`} variant="outline-secondary">Edit User</Button>
                ) : ''}
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
                <p><b>Offices(s): </b>{user.offices && user.offices.length > 0 ? user.offices.toString() : 'N/A'}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p><b>Committees(s): </b>{user.committees && user.committees.length > 0 ? _.pluck(user.committees, 'value').toString() : 'N/A'}</p>
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
                <p><b>Phone: </b>{user.phone ? user.phone : 'N/A'}</p>
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

export default Profile;
