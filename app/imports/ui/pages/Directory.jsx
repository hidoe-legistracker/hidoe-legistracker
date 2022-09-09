import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
// import { Link, withRouter } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
// import ViewBill from './ViewBill';

/* Renders a table containing all of the Measure documents. */
const Directory = () => (

  <Container id={PAGE_IDS.DIRECTORY} className="py-3">
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
      <Col xs={10} className="bill-section">
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
        <Row>
          <div className="bill-table-header">
            <Row>
              <Col>Bill #</Col>
              <Col>Bill</Col>
              <Col>Office</Col>
              <Col>Action</Col>
              <Col>Rationale</Col>
              <Col>Committee</Col>
              <Col>Hearing</Col>
              <Col>Type</Col>
              <Col>Position</Col>
              <Col>Testifier</Col>
              <Col>Status</Col>
            </Row>
          </div>
          <div className="d-grid gap-2">
            <a href="http://localhost:3000/view-bill" className="bill-table">
              <Row>
                <Col>1234</Col>
                <Col>...</Col>
                <Col>OCID BOE</Col>
                <Col>Testimony</Col>
                <Col>...</Col>
                <Col>EDU, FIN</Col>
                <Col>12/02/2022</Col>
                <Col>Hearing</Col>
                <Col>Support</Col>
                <Col>John Doe</Col>
                <Col>1st Crossover</Col>
                <Col>--</Col>
              </Row>
            </a>
          </div>
        </Row>
      </Col>
    </Row>
  </Container>
);

export default Directory;
