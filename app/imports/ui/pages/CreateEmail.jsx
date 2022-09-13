import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders the CreateEmail page for composing emails. */
const CreateEmail = () => (
  <Container id={PAGE_IDS.CREATE_EMAIL} className="py-3">
    <Row className="justify-content-center">
      <h1>Create Email</h1>
      <Container>
        <Row>
          <Col>
            <Button href="/" variant="secondary" size="sm">Address</Button>{' '}
            <Button href="/" variant="secondary" size="sm">Check Names</Button>{' '}
          </Col>
        </Row>
      </Container>
      <Container>
        <hr />
      </Container>
      <Form>
        <Form.Group className="to">
          <Form.Label>To: *</Form.Label>
          <Form.Control type="to" placeholder="" />
        </Form.Group>
        <Form.Group className="cc">
          <Form.Label>Cc: </Form.Label>
          <Form.Control type="cc" placeholder="" />
        </Form.Group>
        <Form.Group className="bcc">
          <Form.Label>Bcc: </Form.Label>
          <Form.Control type="bcc" placeholder="" />
        </Form.Group>
        <Form.Group className="from">
          <Form.Label>From: </Form.Label>
          <Form.Control plaintext readOnly defaultValue="john foo/OSIP/HIDOE" />
        </Form.Group>
        <Form.Group className="date">
          <Form.Label>Date: </Form.Label>
          <Form.Control type="date" placeholder="" />
        </Form.Group>
      </Form>
      <Container>
        <hr />
      </Container>
      <Form>
        <Form.Group className="subject">
          <Form.Label>Subject: </Form.Label>
          <Form.Control type="subject" placeholder="" />
        </Form.Group>
        <Form.Group className="body">
          <Form.Label> </Form.Label>
          <Form.Control type="body" as="textarea" rows={5} />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label />
          <Form.Control type="file" />
        </Form.Group>
      </Form>
      <Col>
        <Button href="/" variant="primary" size="lg">Send</Button>{' '}
      </Col>
    </Row>
  </Container>
);

export default CreateEmail;
