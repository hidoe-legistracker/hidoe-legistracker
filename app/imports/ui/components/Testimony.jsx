import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
// import { useTracker } from 'meteor/react-meteor-data';
// import { Stuffs } from '../../api/stuff/StuffCollection';
// import StuffItem from '../components/StuffItem';
// import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
// import ViewBill from './ViewBill';

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
export const Testimony = React.forwardRef((props, ref) => (
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
          <Row>04/05/2006</Row>
          <Row>04:30 PM</Row>
          <Row>3412 via Videoconference</Row>
          <Row>House of Finance</Row>
        </Col>
        <Row className="row-center">
          <Col xs={2} style={{ marginLeft: 20 }}>
            <Row className="testimony-header2">Department: </Row>
            <Row className="testimony-header2">Testifier: </Row>
            <Row className="testimony-header2">Title of Bill: </Row>
            <Row className="testimony-header2">Purpose of Bill: </Row>
          </Col>
          <Col>
            <Row style={{ marginBottom: 20 }}>Education</Row>
            <Row style={{ marginBottom: 20 }}>Jane Doe, Superintendent of Education</Row>
            <Row style={{ marginBottom: 20 }}>SBC 13134798</Row>
            <Row style={{ marginBottom: 20 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Row>
          </Col>
          <Container>
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
