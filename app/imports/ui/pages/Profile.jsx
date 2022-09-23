import React from 'react';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

/* Renders the Profile page for viewing your profile. */
const Profile = () => {
  const profilePic = { float: 'right', width: '200px' };

  const { employeeID } = useParams();

  const { user, ready } = useTracker(() => {
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();

    let usr = UserProfiles.findOne({ employeeID: employeeID }, {});
    if (usr === undefined) usr = AdminProfiles.findOne({ employeeID: employeeID }, {});
    return {
      user: usr,
      ready: rdy,
    };
  }, [employeeID]);

  return (ready ? (
    <Container id={PAGE_IDS.PROFILE} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Your Profile</h2></Col>
          <Card>
            <Card.Body>
              <Card.Img style={profilePic} src="https://www.pbshawaii.org/wp-content/uploads/2016/03/hawaii-doe.png" alt="Hawaii DOE Logo" />
              <Card.Title>First Name:</Card.Title>
              <Card.Text>{user.firstName}</Card.Text>
              <Card.Title>Last Name:</Card.Title>
              <Card.Text>{user.lastName}</Card.Text>
              <Card.Title>Email:</Card.Title>
              <Card.Text>{user.email}</Card.Text>
              <Card.Title>Employee ID:</Card.Title>
              <Card.Text>{user.employeeID}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  ) : '');
};

export default Profile;
