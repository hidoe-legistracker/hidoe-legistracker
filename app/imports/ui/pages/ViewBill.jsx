import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
// import { useTracker } from 'meteor/react-meteor-data';
// import { Stuffs } from '../../api/stuff/StuffCollection';
// import StuffItem from '../components/StuffItem';
// import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row.
*
*   // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
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
  *
  *  <LoadingSpinner message="Loading Stuff" />
*
* */

const ViewBill = () => (
  <Container id={PAGE_IDS.VIEW_BILL} className="py-3">
    <h2>Bill #1234</h2>
    <Row className="justify-content-md-center">
      <Col xs lg="2">
        1 of 3
      </Col>
      <Col md="auto">Variable width content</Col>
      <Col xs lg="2">
        3 of 3
      </Col>
    </Row>
    <Row>
      <Col>1 of 3</Col>
      <Col md="auto">Variable width content</Col>
      <Col xs lg="2">
        3 of 3
      </Col>
    </Row>
  </Container>
);

export default ViewBill;
