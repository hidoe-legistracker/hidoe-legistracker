import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

// used https://www.npmjs.com/package/react-to-print
export const Testimony = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <Container id={PAGE_IDS.VIEW_TESTIMONY} className="view-testimony-container">
      <Row className="row-center">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/d/d3/HSSC_Seal.png" className="logo" />
        <Row className="letterhead" style={{ marginTop: 10 }}>STATE OF HAWAII</Row>
        <Row className="letterhead">DEPARTMENT OF EDUCATION</Row>
        <Row className="letterhead" style={{ fontWeight: 'normal' }}>P.O. BOX 2360</Row>
        <Row className="letterhead" style={{ marginBottom: 20, fontWeight: 'normal' }}>HONOLULU, HAWAI`I 96894</Row>
      </Row>
      <Row className="row-center">
        <Col>
          <Row className="testimony-header1">Date: </Row>
          <Row className="testimony-header1">Time: </Row>
          <Row className="testimony-header1">Location: </Row>
          <Row className="testimony-header1">Committee: </Row>
        </Col>
        <Col style={{ padding: 0 }}>
          <Row>04/05/2006</Row>
          <Row>04:30 PM</Row>
          <Row>3412 via Videoconference</Row>
          <Row>House of Finance</Row>
        </Col>
        <Row className="row-center">
          <Row>
            <Col className="testimony-header2" xs={2}>Department</Col>
            <Col>Education</Col>
          </Row>
          <Row>
            <Col className="testimony-header2" xs={2}>Testifier</Col>
            <Col>Jane Doe, Superintendent of Education</Col>
          </Row>
          <Row>
            <Col className="testimony-header2" xs={2}>Title of Bill</Col>
            <Col>SBC 13134798</Col>
          </Row>
          <Row>
            <Col className="testimony-header2" xs={2}>Purpose of Bill</Col>
            <Col>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Col>
          </Row>
          <Container style={{ marginTop: 10 }}>
            <Col>
              <Row className="testimony-header2">Department Position: </Row>
            </Col>
            <Col>
              <Row style={{ marginBottom: 20 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Row>
            </Col>
          </Container>
        </Row>
      </Row>
    </Container>
  </div>
));
