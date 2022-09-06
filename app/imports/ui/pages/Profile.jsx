import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const Profile = () => (
  <Container>
    <Row className="justify-content-center">
      <Col xs={5}>
        <Col className="text-center"><h2>Profile</h2></Col>
        <Card>
          <Card.Body>
            <TextField name="name" />
            <NumField name="quantity" decimal={null} />
            <SelectField name="condition" />
            <SubmitField value="Submit" />
            <ErrorsField />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Profile;
