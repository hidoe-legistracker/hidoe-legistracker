import React from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const Directory = () => (
  <Container id={PAGE_IDS.LIST_STUFF} className="py-3">
    <Row className="justify-content-center">
      <Col className="folder-section">
        <h6 align="center">Legislative Tracking System 2022</h6>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Administrator</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>DOE</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Deputy</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>HEARING NOTICES</Accordion.Header>
            <Accordion.Body>
              Monitoring Reports
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>OCID</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="5">
            <Accordion.Header>OFO</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="6">
            <Accordion.Header>OFS</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="7">
            <Accordion.Header>OHE</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="8">
            <Accordion.Header>OITS</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="9">
            <Accordion.Header>OSIP</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="10">
            <Accordion.Header>OSSS</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="11">
            <Accordion.Header>OTM</Accordion.Header>
          </Accordion.Item>
          <Accordion.Item eventKey="12">
            <Accordion.Header>Supt</Accordion.Header>
            <Accordion.Body>Action-Monitor</Accordion.Body>
            <Accordion.Body>Action-Testimony</Accordion.Body>
            <Accordion.Body>Action-Testimony Active</Accordion.Body>
            <Accordion.Body>Action-Testimony with Testimony</Accordion.Body>
            <Accordion.Body>Active Bills by Bill #</Accordion.Body>
            <Accordion.Body>Acts</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="13">
            <Accordion.Header>Testimony</Accordion.Header>
          </Accordion.Item>
        </Accordion>
      </Col>
      <Col xs={9} className="bill-section">
        <Button variant="secondary" size="sm" className="bill-button-spacing">
          View Bill by Status
        </Button>
        <Button variant="secondary" size="sm" className="bill-button-spacing">
          Create Tracking Document
        </Button>
        <Button variant="secondary" size="sm" className="bill-button-spacing">
          Send DocLink
        </Button>
        <Button variant="secondary" size="sm" className="bill-button-spacing">
          Export to XL
        </Button>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Bill #</th>
              <th>Bill / Resolution</th>
              <th>Office</th>
              <th>Action</th>
              <th>Rationale</th>
              <th>Committee</th>
              <th>Hearing</th>
              <th>Hearing Type</th>
              <th>DOE Position</th>
              <th>Testifier</th>
              <th>Status</th>
              <th>Act #</th>
              <th>Proposed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1234</th>
              <th>...</th>
              <th>OCID BOE</th>
              <th>Testimony</th>
              <th>...</th>
              <th>EDU, FIN</th>
              <th>12/02/2022</th>
              <th>Hearing</th>
              <th>Support</th>
              <th>John Doe</th>
              <th>1st Crossover</th>
              <th>123</th>
              <th>...</th>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  </Container>
);

export default Directory;
