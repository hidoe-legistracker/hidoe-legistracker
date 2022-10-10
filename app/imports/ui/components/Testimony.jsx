import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

// used https://www.npmjs.com/package/react-to-print
export const Testimony = React.forwardRef(({ testimony }, ref) => {
  return (
    <div ref={ref}>
      <Container>
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
            <Col xs={2} style={{ marginLeft: 20 }}>
              <Row className="testimony-header2">Department: </Row>
              <Row className="testimony-header2">Testifier: </Row>
              <Row className="testimony-header2">Title of Bill: </Row>
              <Row className="testimony-header2">Purpose of Bill: </Row>
            </Col>
            <Col>
              <Row style={{ marginBottom: 20 }}>{testimony.department}</Row>
              <Row style={{ marginBottom: 20 }}>{testimony.testifier}</Row>
              <Row style={{ marginBottom: 20 }}>{testimony.measureTitle}</Row>
              <Row style={{ marginBottom: 20 }}>{testimony.measureDescription}</Row>
            </Col>
            <Container>
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
  );
});

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
