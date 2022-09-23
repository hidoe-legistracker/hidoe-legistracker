import React from 'react';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Card, Col, Container, Row, Button } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

/* Renders the Profile page for viewing your profile. */
const Profile = () => {
  const profilePic = { float: 'right', width: '200px' };
  const profileCard = { marginTop: '20px', boxShadow: '0.1px 0.1px 5px #cccccc', borderRadius: '0.5em' };

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
                <Button variant="outline-secondary">Edit User</Button>
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
                <p><b>Department(s): </b>EDU</p>
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
                <p><b>Phone: </b>(808) 123-4567</p>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
  ) : '');
};

export default Profile;
