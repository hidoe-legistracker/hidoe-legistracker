import React from 'react';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from './LoadingSpinner';

// used https://www.npmjs.com/package/react-to-print
export const Testimony = React.forwardRef((props, ref) => {
  const { _id } = useParams();
  const { measure, testimony, ready } = useTracker(() => {
    const testimonySubscription = Testimonies.subscribeTestimony();
    const measureSubscription = Measures.subscribeMeasures();
    const rdy = testimonySubscription.ready() && measureSubscription.ready();
    const testimonyDoc = Testimonies.findDoc(_id);
    const billNumber = testimonyDoc.billNumber;
    const measureDoc = Measures.findOne({ measureNumber: billNumber });
    return {
      measure: measureDoc,
      testimony: testimonyDoc,
      ready: rdy,
    };
  }, [_id]);
  return ready ? (
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
            <Row>{testimony.hearingDate.toLocaleDateString()}</Row>
            <Row>{testimony.hearingDate.toLocaleTimeString()}</Row>
            <Row>{testimony.hearingLocation}</Row>
            <Row>{testimony.committeeName}</Row>
          </Col>
          <Row className="row-center">
            <Row>
              <Col className="testimony-header2" xs={2}>Department</Col>
              <Col>Education</Col>
            </Row>
            <Row>
              <Col className="testimony-header2" xs={2}>Testifier</Col>
              <Col>{testimony.testifier}, {testimony.representing}</Col>
            </Row>
            <Row>
              <Col className="testimony-header2" xs={2}>Title of Bill</Col>
              <Col>{measure.measureTitle}</Col>
            </Row>
            <Row>
              <Col className="testimony-header2" xs={2}>Purpose of Bill</Col>
              <Col>{measure.description}</Col>
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
  ) : <LoadingSpinner />;
});
