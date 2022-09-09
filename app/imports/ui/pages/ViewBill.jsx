import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
// import { useTracker } from 'meteor/react-meteor-data';
// import { Stuffs } from '../../api/stuff/StuffCollection';
// import StuffItem from '../components/StuffItem';
// import LoadingSpinner from '../components/LoadingSpinner';
import Form from 'react-bootstrap/Form';
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
  <Container id={PAGE_IDS.VIEW_BILL} className="view-bill-container">
    <h1>Bill #1234</h1>
    <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
      <Col>
        <Row style={{ fontWeight: 'bold' }}>Bill / Resolution</Row>
        <Row>...............</Row>
      </Col>
    </Row>
    <Row style={{ alignContent: 'center', justifyContent: 'center', margin: 0 }}>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Office</Row>
        <Row>OCID BOE</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Action</Row>
        <Row>Testimony</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Act #</Row>
        <Row>--</Row>
      </Col>
    </Row>
    <Row style={{ alignContent: 'center', justifyContent: 'center', margin: 0 }}>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Rationale</Row>
        <Row>..............</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Committee Referral</Row>
        <Row>EDU, FIN</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Committee</Row>
        <Row>Conference</Row>
      </Col>
    </Row>
    <Row style={{ alignContent: 'center', justifyContent: 'center', margin: 0 }}>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>DOE Position</Row>
        <Row>Support</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Testifier(s)</Row>
        <Row>John Doe</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Status</Row>
        <Row>1st Crossover</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Proposed</Row>
        <Row>..........</Row>
      </Col>
    </Row>
    <Row style={{ alignContent: 'center', justifyContent: 'center', margin: 0 }}>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Hearing Date</Row>
        <Row>12/02/2022</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Hearing Time</Row>
        <Row>12:00pm</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Hearing Location</Row>
        <Row>CR 229</Row>
      </Col>
      <Col className="view-bill-columns">
        <Row style={{ fontWeight: 'bold' }}>Hearing Type</Row>
        <Row>Hearing</Row>
      </Col>
    </Row>
    <Row style={{ marginTop: 10 }}>
      <Form>
        <Form.Check
          inline
          label="I want to receive notifications for this bill"
        />
      </Form>
    </Row>
  </Container>
);

export default ViewBill;
