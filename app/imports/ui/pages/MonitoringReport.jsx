import React, { useState } from 'react';
import {
  Container,
  Row,
  ListGroup,
  Col,
  Form,
  Button, Card, Breadcrumb, Badge,
} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { AutoForm, DateField, LongTextField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import _ from 'underscore/underscore-node';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import { Measures } from '../../api/measure/MeasureCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  committeeChair: String,
  committeeName: String,
  billNumber: String,
  billDraftNumber: {
    type: String,
    optional: true,
  },
  hearingDate: {
    type: Date,
    optional: true,
  },
  hearingLocation: {
    type: String,
    optional: true,
  },
  deptPosition: {
    type: String,
    allowedValues: ['In Support', 'In Opposition', 'Comments'],
  },
  introduction: String,
  content: String,
  closing: {
    type: String,
    optional: true,
  },
  testifier: String,
  representing: {
    type: String,
    optional: true,
  },
  contactEmail: {
    type: String,
    optional: true,
  },
  contactPhone: {
    type: String,
    optional: true,
  },
  office: {
    type: String,
    allowedValues: ['OCID', 'OFO', 'OFS', 'OHE', 'OITS', 'OSIP', 'OSSS', 'OTM'],
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const CreateTestimony = ({ measureNumber }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let fRef = null;

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { committeeChair, billNumber, committeeName, billDraftNumber, hearingDate, hearingLocation, deptPosition, introduction, content, closing, testifier, representing, contactEmail, contactPhone, office } = data;
    const owner = Meteor.user().username;
    const testimonyProgress = [0];
    const collectionName = Testimonies.getCollectionName();
    if (parseInt(billNumber, 10) === parseInt(measureNumber.valueOf(), 10)) {
      const definitionData = { owner, committeeChair, committeeName, billNumber, billDraftNumber, hearingDate, hearingLocation, deptPosition, introduction, content, closing, testifier,
        representing, contactEmail, contactPhone, testimonyProgress, office };
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', `Testimony added to Bill #${billNumber} successfully`, 'success');
          formRef.reset();
        });
    } else {
      swal('Error', 'Bill number is not in database or does not match current bill number. Please enter another bill number.');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Testimony
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ justifyContent: 'center' }}>Testimony</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row className="justify-content-center">
              <Col>
                <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
                  <Card>
                    <Card.Body>
                      <Row>
                        <h4>Address To</h4>
                      </Row>
                      <Row>
                        <Col>
                          <TextField name="committeeChair" label="Committee Chair *" />
                        </Col>
                        <Col>
                          <TextField name="committeeName" label="Committee Name *" />
                        </Col>
                      </Row>

                      <Row>
                        <h4>Bill / Resolution Information</h4>
                      </Row>
                      <Row>
                        <Col>
                          <TextField name="billNumber" label="Bill / Resolution Number" />
                        </Col>
                        <Col>
                          <TextField name="billDraftNumber" label="Draft Number" />
                        </Col>
                      </Row>

                      <Row>
                        <h4>Hearing Information</h4>
                      </Row>
                      <Row>
                        <Col>
                          <DateField name="hearingDate" label="Hearing Date" />
                        </Col>
                        <Col>
                          <TextField name="hearingLocation" label="Hearing Location" />
                        </Col>
                      </Row>

                      <br />
                      <Row>
                        <h4>Testimony</h4>
                      </Row>
                      <Row>
                        <Col>
                          <SelectField name="deptPosition" label="Position *" />
                        </Col>
                        <Col />
                      </Row>
                      <Row>
                        <LongTextField name="introduction" label="Introduction *" />
                      </Row>
                      <ul>
                        <li>Introduce who you are and/or the group or organization you represent</li>
                        <li>State your position on the measure (&quot;I am testifying in favor of…&quot; or &quot;I am testifying against…&quot;)</li>
                      </ul>
                      <Row>
                        <LongTextField name="content" label="Content *" />
                      </Row>
                      <ul>
                        <li>Reasons for taking your position</li>
                        <li>Start with most important or compelling</li>
                        <li>Include facts, figures, experiences, or narratives to support your position</li>
                      </ul>
                      <Row>
                        <LongTextField name="closing" label="Closing" />
                      </Row>
                      <ul>
                        <li>Include any summary remarks and re-state your position</li>
                      </ul>

                      <br />
                      <Row>
                        <h4>Affiliations</h4>
                      </Row>
                      <Row>
                        <TextField name="representing" label="Name any groups you are representing here:" />
                      </Row>

                      <br />
                      <Row>
                        <h4>Testifier Information</h4>
                      </Row>
                      <Row>
                        <TextField name="testifier" label="Your Name (First, Last) *" />
                      </Row>
                      <Row>
                        <Col>
                          <TextField name="contactPhone" label="Phone" />
                        </Col>
                        <Col>
                          <TextField name="contactEmail" label="Email" />
                        </Col>
                      </Row>
                      <Row>
                        <SelectField name="office" />
                      </Row>
                      <Row>
                        <Col>
                          <SubmitField value="Submit Testimony" />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </AutoForm>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

CreateTestimony.propTypes = {
  measureNumber: PropTypes.number.isRequired,
};

const MonitoringReport = () => {
  const date = new Date();

  const { _id } = useParams();

  const { measure, ready, testimonies, user } = useTracker(() => {
    const measureSubscription = Measures.subscribeMeasures();
    const testimonySubscription = Testimonies.subscribeTestimony();
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = measureSubscription.ready() && testimonySubscription.ready() && userSubscription.ready() && adminSubscription.ready();

    const username = Meteor.user() ? Meteor.user().username : '';

    const measureItem = Measures.findOne({ _id: _id }, {});
    const testimonyCollection = Testimonies.find({}, {}).fetch();

    let usr = UserProfiles.findOne({ email: username });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: username });
    }

    return {
      measure: measureItem,
      testimonies: testimonyCollection,
      user: usr,
      ready: rdy,
    };
  }, [_id]);

  return ready ? (
    <div>
      <Container>
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item href="/directory">Directory</Breadcrumb.Item>
            <Breadcrumb.Item href={`/view-bill/${_id}`}>View Bill</Breadcrumb.Item>
            <Breadcrumb.Item active>Monitoring Report</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
      </Container>
      <Container id={PAGE_IDS.MONITORING_REPORT} className="view-bill-container" style={{ marginTop: 0 }}>
        <Container style={{ padding: 20 }}>
          <Row className="mb-5">
            <Col className="align-left">
              <ListGroup horizontal="sm">
                <ListGroup.Item><strong>Bill #: </strong> {measure.measureNumber} </ListGroup.Item>
                <ListGroup.Item><strong>Date: </strong> {`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`} </ListGroup.Item>
                <ListGroup.Item><strong>Time: </strong> {`${date.getHours()}:${date.getMinutes()}`} </ListGroup.Item>
                <ListGroup.Item><strong>Location: </strong> CR 229 </ListGroup.Item>
                <ListGroup.Item><strong>Committee: </strong> {measure.currentReferral} </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col className="align-center">
              <ListGroup>
                <ListGroup.Item><strong>Department: </strong>Education </ListGroup.Item>
                <ListGroup.Item><strong>Title of Bill: </strong> {measure.measureTitle} </ListGroup.Item>
                <ListGroup.Item><strong>Purpose of Bill: </strong> {measure.description} </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mb-5">
            <Form>
              <Form.Group className="mb-2">
                <CreateTestimony measureNumber={measure.measureNumber} />
              </Form.Group>

            </Form>
          </Row>
          <Container className="view-testimony-container">
            <h3>{_.where(testimonies, { billNumber: measure.measureNumber }).length === 0 ? 'No testimonies available' : `Submitted testimonies for ${user.offices.map(office => (` ${office}`))}` } </h3>
            {_.where(testimonies, { billNumber: measure.measureNumber }).length === 0 ? '' : (
              <Table>
                <thead>
                  <tr>
                    <th scope="col">Hearing Date</th>
                    <th scope="col">Bill #</th>
                    <th scope="col">Prepared By</th>
                    <th scope="col">Office</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {_.where(testimonies, { billNumber: measure.measureNumber }).map(testimony => (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>
                      { testimony.testimonyProgress.length !== 6 && testimony.office === user.offices.find(element => element === testimony.office) ? (
                        <Link className="table-row" to={`/view-testimony/${measure._id}&${testimony._id}`}>
                          <th scope="row">{testimony.hearingDate ? testimony.hearingDate.toLocaleDateString() : '-'}</th>
                          <td>{testimony.billNumber}</td>
                          <td>{testimony.testifier}</td>
                          <td>{testimony.office}</td>
                          <td>
                            {testimony.testimonyProgress.length === 6 ? <Badge bg="secondary">Completed</Badge> : ''}
                            {testimony.testimonyProgress.length === 5 ? <Badge bg="primary">Finalizing Testimony</Badge> : ''}
                            {testimony.testimonyProgress.length === 4 ? <Badge bg="warning">Waiting for Final Approval</Badge> : ''}
                            {testimony.testimonyProgress.length === 3 ? <Badge bg="success">Waiting for PIPE Approval</Badge> : ''}
                            {testimony.testimonyProgress.length === 2 ? <Badge bg="primary">Waiting for Office Approval</Badge> : ''}
                            {testimony.testimonyProgress.length === 1 ? <Badge bg="secondary">Testimony being written</Badge> : ''}
                          </td>
                        </Link>
                      )

                        : '' }
                    </>
                  ))}
                </tbody>
              </Table>
            )}
          </Container>
          <Row>
            <Col>
              <ListGroup variant="flush">
                <ListGroup.Item className="text-secondary">Last accessed by: {`${Meteor.user().username}`}</ListGroup.Item>
                <ListGroup.Item className="text-secondary">Last accessed on:  {`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`} {`${date.getHours()}:${date.getMinutes()}`}</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default MonitoringReport;
