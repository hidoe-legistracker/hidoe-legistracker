import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

const ForgotPassword = () => (
  <Container id={PAGE_IDS.CHANGE_PASSWORD} className="py-3">
    <Row className="justify-content-center">
      <Col md={9} lg={6}>
        <Col className="text-center">
          <h2>Forgot your Password?</h2>
        </Col>
        <Card>
          <Card.Body>
            Please contact the appropriate IT person from your Department. <br />
            Email: admin@foo.com
          </Card.Body>
        </Card>
        <Alert variant="secondary">
          Remember your password? Click <Link to="/signin">here</Link>
        </Alert>
      </Col>
    </Row>
  </Container>
);

export default ForgotPassword;
