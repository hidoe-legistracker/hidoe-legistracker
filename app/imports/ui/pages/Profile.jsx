import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders the Profile page for viewing your profile. */
const Profile = () => {

  const profilePic = { float: 'right', width: '200px' };

  return (
    <Container id={PAGE_IDS.PROFILE} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Your Profile</h2></Col>
          <Card>
            <Card.Body>
              <Card.Img style={profilePic} src="https://www.pbshawaii.org/wp-content/uploads/2016/03/hawaii-doe.png" alt="Hawaii DOE Logo" />
              <Card.Title>First Name:</Card.Title>
              <Card.Text>john</Card.Text>
              <Card.Title>Last Name:</Card.Title>
              <Card.Text>foo</Card.Text>
              <Card.Title>Email:</Card.Title>
              <Card.Text>john@foo.com</Card.Text>
              <Card.Title>Employee ID:</Card.Title>
              <Card.Text>012345678</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
