import React from 'react';
import { Col, Container, Row, ProgressBar } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import { Link } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';

const billProgress = 60;

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
          <Table>
            <thead>
              <tr>
                <th scope="col">Bill #</th>
                <th scope="col">Bill</th>
                <th scope="col">Office</th>
                <th scope="col">Action</th>
                <th scope="col">Rationale</th>
                <th scope="col">Committee</th>
                <th scope="col">Hearing</th>
                <th scope="col">Type</th>
                <th scope="col">Position</th>
                <th scope="col">Testifier</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <Link className="table-row" to="/view-bill">
                <th scope="row">1234</th>
                <td>.....</td>
                <td>OCID BOE</td>
                <td>Testimony</td>
                <td>........</td>
                <td>EDU, FIN</td>
                <td>12/02/2022</td>
                <td>Hearing</td>
                <td>Support</td>
                <td>John Doe</td>
                <td>
                  <ProgressBar now={billProgress} label={`${billProgress}`} visuallyHidden />
                </td>
              </Link>
            </tbody>
          </Table>
        </Row>
      </Col>
    </Row>
  </Container>
);

export default Directory;
