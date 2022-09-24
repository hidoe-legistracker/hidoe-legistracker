import React from 'react';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row } from 'react-bootstrap';
// import { useTracker } from 'meteor/react-meteor-data';
// import { Stuffs } from '../../api/stuff/StuffCollection';
// import StuffItem from '../components/StuffItem';
// import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
// import ViewBill from './ViewBill';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import LoadingSpinner from './LoadingSpinner';

/*
// useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const { ready, stuffs } = useTracker(() => {
  // Note that this subscription will get cleaned up
  // when your component is unmounted or deps change.
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuff();
  // Determine if the subscription is ready
  const rdy = subscription.ready();
  // Get the Stuff documents
  const stuffItems = Stuffs.find({}, { sort: { name: 1 } }).fetch();
  return {
    stuffs: stuffItems,
    ready: rdy,
  };
}, []);
* : <LoadingSpinner message="Loading Stuff" />)
 */

// used https://www.npmjs.com/package/react-to-print
export const Testimony = React.forwardRef((props, ref) => {
  const { _id } = useParams();
  const { testimony, ready } = useTracker(() => {
    const subscription = Testimonies.subscribeTestimony();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const testimonyDoc = Testimonies.findDoc(_id);
    return {
      testimony: testimonyDoc,
      ready: rdy,
    };
  }, [_id]);
  return ready ? (
    <div ref={ref}>
      <Container id={PAGE_IDS.VIEW_TESTIMONY} className="view-testimony-container">
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
                <Row style={{ marginBottom: 20 }}>{testimony.deptPosition}</Row>
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
