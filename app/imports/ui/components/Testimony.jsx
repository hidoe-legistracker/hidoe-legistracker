import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

// used https://www.npmjs.com/package/react-to-print
export const Testimony = React.forwardRef(({ testimony }, ref) => (
  <div ref={ref}>
    <Container>
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
          <Row>{testimony.hearingDate}</Row>
          <Row>{testimony.hearingTime}</Row>
          <Row>{testimony.hearingLocation}</Row>
          <Row>{testimony.committeeName}</Row>
        </Col>
        <Row className="row-center">
          <Row>
            <Col className="testimony-header2" xs={2}>Department</Col>
            <Col>{testimony.department}</Col>
          </Row>
          <Row>
            <Col className="testimony-header2" xs={2}>Testifier</Col>
            <Col>{testimony.testifier}</Col>
          </Row>
          <Row>
            <Col className="testimony-header2" xs={2}>Title of Bill</Col>
            <Col>{testimony.measureTitle}</Col>
          </Row>
          <Row>
            <Col className="testimony-header2" xs={2}>Purpose of Bill</Col>
            <Col>{testimony.measureDescription}</Col>
          </Row>
          <Container style={{ marginTop: 10 }}>
            <Col>
              <Row className="testimony-header2">Department Position: </Row>
            </Col>
            <Col>
              <Row style={{ marginBottom: 20 }}>{testimony.introduction}</Row>
              <Row style={{ marginBottom: 20 }}>{testimony.content}</Row>
              <Row style={{ marginBottom: 20 }}>{testimony.closing}</Row>
            </Col>
          </Container>
        </Row>
      </Row>
    </Container>
  </div>
));

Testimony.propTypes = {
  testimony: PropTypes.shape({
    hearingDate: PropTypes.string,
    hearingTime: PropTypes.string,
    hearingLocation: PropTypes.string,
    committeeName: PropTypes.string,
    department: PropTypes.string,
    testifier: PropTypes.string,
    introduction: PropTypes.string,
    content: PropTypes.string,
    closing: PropTypes.string,
    measureTitle: PropTypes.string,
    measureDescription: PropTypes.string,
  }).isRequired,
};
