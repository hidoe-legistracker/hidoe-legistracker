import React from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { FileEarmarkText } from 'react-bootstrap-icons';
// import { useTracker } from 'meteor/react-meteor-data';
// import { Stuffs } from '../../api/stuff/StuffCollection';
// import StuffItem from '../components/StuffItem';
// import LoadingSpinner from '../components/LoadingSpinner';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
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
    <Container>
      <Row>
        <Col>
          <Button href="/create-testimony" variant="secondary" size="sm" className="bill-button-spacing">
            <FileEarmarkText style={{ marginRight: '0.5em', marginTop: '-5px' }} />
            Create Testimony
          </Button>
          <Button variant="secondary" size="sm" className="bill-button-spacing" href="/monitoringreport">
            <FileEarmarkText style={{ marginRight: '0.5em', marginTop: '-5px' }} />
            Monitoring Report
          </Button>
        </Col>
      </Row>
    </Container>
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
    <Container className="view-testimony-container">
      <h3>Testimonies</h3>
      <Row>
        <div className="testimonies-table-header">
          <Row>
            <Col>Hearing Date</Col>
            <Col>Bill #</Col>
            <Col>Status</Col>
            <Col>Prepared by</Col>
            <Col>DOE Position</Col>
            <Col>Same</Col>
          </Row>
        </div>
        <div className="d-grid gap-2">
          <Link className="testimonies-table" to="/testimony-page">
            <Row>
              <Col>04/05/2006</Col>
              <Col>SB 2319847</Col>
              <Col>Approved</Col>
              <Col>Jane Doe</Col>
              <Col>Support</Col>
              <Col>Testimony same as ...</Col>
            </Row>
          </Link>
        </div>
      </Row>
    </Container>

    <hr
      style={{
        background: 'black',
        color: 'black',
        borderColor: 'black',
        height: '1px',
      }}
    />
    <Row style={{ marginTop: 10 }}>
      <Form>
        <Form.Check
          inline
          label="I want to receive hearing notifications for this bill"
        />
      </Form>
    </Row>
  </Container>
);

export default ViewBill;
