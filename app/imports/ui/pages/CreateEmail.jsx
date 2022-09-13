import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { DateField, LongTextField, TextField } from 'uniforms-bootstrap5';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders the CreateEmail page for composing emails. */
const CreateEmail = () => (
  <Container id={PAGE_IDS.CREATE_EMAIL} className="py-3">
    <Row className="justify-content-center">
      <h1>Create Email</h1>
      <Row>--------------</Row>
      <Container>
        <Row>
          <Col>
            <Button href="/" variant="secondary" size="sm">Address</Button>
            <Button href="/" variant="secondary" size="sm">Check Names</Button>
          </Col>
        </Row>
      </Container>
      <Row>
        <div>
          <TextField name="to" label="To: *" />
        </div>
        <div>
          <TextField name="cc" label="cc: " />
        </div>
        <div>
          <TextField name="bcc" label="bcc: " />
        </div>
        <div>
          <TextField name="profile-name" label="From: *" />
        </div>
        <div>
          <DateField name="date" label="Date: *" />
        </div>
      </Row>
      <Row>--------------</Row>
      <Row>
        <TextField name="subject" label="Subject: " />
      </Row>
      <Row>
        <LongTextField name="body" label="" />
      </Row>
      <Row>
        <Col>
          <Button style={{ marginRight: 2 }} variant="secondary" size="sm">Send</Button>
        </Col>
      </Row>
    </Row>
  </Container>
);

export default CreateEmail;
