import React from 'react';
import { Col, Container, Row, Button, ProgressBar } from 'react-bootstrap';
import { FileEarmarkText } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { Measures } from '../../api/measure/MeasureCollection';

const billProgress = 60;

const ViewBill = () => {
  const { ready, testimonies, measure } = useTracker(({ match }) => {
    const id = match.params._id;
    const sub1 = Testimonies.subscribeTestimony();
    const sub2 = Measures.subscribeMeasures();
    const rdy = sub1.ready() && sub2.ready();
    const testimonyItems = Testimonies.find().fetch();
    const measureItems = Measures.findOne(id);
    return {
      ready: rdy,
      testimonies: testimonyItems,
      measure: measureItems,
    };
  }, []);

  return ready ? (
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
      <h1>Bill #{measure.measureNumber}</h1>
      <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
        <Col>
          <Row style={{ fontWeight: 'bold' }}>Bill / Resolution</Row>
          <Row>{measure.description}</Row>
        </Col>
      </Row>
      <Row style={{ alignContent: 'center', justifyContent: 'center', margin: 0 }}>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Office</Row>
          <Row>{measure.currentReferral}</Row>
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
          <Row>{measure.currentReferral}</Row>
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
          <Row>{measure.status}</Row>
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
        <h3>{testimonies.length === 0 ? 'No testimonies available' : 'Testimonies'}</h3>
        {testimonies.length === 0 ? '' : (
          <Table>
            <thead>
              <tr>
                <th scope="col">Hearing Date</th>
                <th scope="col">Bill #</th>
                <th scope="col">Prepared By</th>
                <th scope="col">DOE Positon</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {testimonies.map(testimony => (
                <Link className="table-row" to={`/view-testimony/${testimony._id}`}>
                  <th scope="row">{testimony.hearingDate.toLocaleDateString()}</th>
                  <td>{testimony.billNumber}</td>
                  <td>{testimony.testifier}</td>
                  <td>{testimony.deptPosition}</td>
                  <td>
                    <ProgressBar now={billProgress} label={`${billProgress}`} visuallyHidden />
                  </td>
                </Link>
              ))}
            </tbody>
          </Table>
        )}
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
  ) : <LoadingSpinner message="Loading Data" />;
};

/*
ViewBill.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  testimony: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  measure: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const id = match.params._id;
  // Get access to documents.
  const sub1 = Meteor.subscribe(Measures.getPublicationName());
  const sub2 = Meteor.subscribe(Testimonies.getPublicationName());
  // Get access to documents for admin
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready();
  // Get the documents
  const testimonies = Testimonies.collection.find().fetch();
  const measures = Measures.collection.findOne(id);
  return {
    testimony: testimonies,
    measure: measures,
    ready,
  };
})(ViewBill);
*
 */
export default ViewBill;
