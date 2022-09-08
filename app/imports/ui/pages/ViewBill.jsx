import React from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
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
    <Row className="justify-content-center">
      <Col md={7}>
        <Col className="text-center">
          <h2>Bill #1234</h2>
        </Col>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>...</th>
              <th>OCID BOE</th>
              <th>Testimony</th>
              <th>...</th>
              <th>EDU, FIN</th>
              <th>12/02/2022</th>
              <th>Hearing</th>
              <th>Support</th>
              <th>John Doe</th>
              <th>1st Crossover</th>
              <th> </th>
              <th>123</th>
              <th>...</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  </Container>
);

export default ViewBill;
