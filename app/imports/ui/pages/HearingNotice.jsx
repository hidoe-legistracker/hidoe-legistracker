import React from 'react';
import { Col, Container, Row, Breadcrumb } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { PAGE_IDS } from '../utilities/PageIDs';

const HearingNotice = () => (
  <div>
    <Container>
      <Row>
        <Breadcrumb>
          <Breadcrumb.Item href="/directory">Directory</Breadcrumb.Item>
          <Breadcrumb.Item active>Hearing</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
    </Container>
    <Container id={PAGE_IDS.HEARING_NOTICE} className="view-bill-container" style={{ marginTop: 0 }}>
      <h1>Hearing Notice</h1>
      <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
        <Col>
          <Row style={{ fontWeight: 'bold' }}>Hearing Date & Time</Row>
          <Row>{}</Row>
        </Col>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Hearing Location</Row>
          <Row>{}</Row>
        </Col>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Hearing Type</Row>
          <Row>{}</Row>
        </Col>
      </Row>
      <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
        <Col>
          <Row style={{ fontWeight: 'bold' }}>Office(s)</Row>
          <Row>{}</Row>
        </Col>
        <Col>
          <Row style={{ fontWeight: 'bold' }}>Committee(s)</Row>
          <Row>{}</Row>
        </Col>
      </Row>
      <Container className="view-testimony-container">
        <h3>Bills on Agenda</h3>
        <Table>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Code</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
        </Table>
      </Container>
    </Container>
  </div>
);

export default HearingNotice;
