import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
// import { useTracker } from 'meteor/react-meteor-data';
// import { Stuffs } from '../../api/stuff/StuffCollection';
// import StuffItem from '../components/StuffItem';
// import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';

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

const Testimony = () => (

  <Container id={PAGE_IDS.VIEW_TESTIMONY} className="view-testimony-container">
    <Row className="row-center">
      <Col>
        <Row className="testimony-header">Date: </Row>
        <Row className="testimony-header">Time: </Row>
        <Row className="testimony-header">Location: </Row>
        <Row className="testimony-header">Committee: </Row>
      </Col>
      <Col style={{ padding: 0 }}>
        <Row>04/05/2006</Row>
        <Row>04:30 PM</Row>
        <Row>3412 via Videoconference</Row>
        <Row>House of Finance</Row>
      </Col>
    </Row>
  </Container>
);
export default Testimony;
