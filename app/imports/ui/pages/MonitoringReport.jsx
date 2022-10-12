import React, { useState } from 'react';
import {
  Container,
  Row,
  ListGroup,
  Col,
  Form,
  Alert,
  DropdownButton,
  Dropdown,
  Button, Accordion, Badge, Card, Breadcrumb
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
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import { Measures } from '../../api/measure/MeasureCollection';

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
});

const bridge = new SimpleSchema2Bridge(formSchema);

const CreateTestimony = ({ measureNumber }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let fRef = null;

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { committeeChair, billNumber, committeeName, billDraftNumber, hearingDate, hearingLocation, deptPosition, introduction, content, closing, testifier, representing, contactEmail, contactPhone } = data;
    const owner = Meteor.user().username;
    const collectionName = Testimonies.getCollectionName();
    if (parseInt(billNumber, 10) === parseInt(measureNumber.valueOf(), 10)) {
      const definitionData = { owner, committeeChair, committeeName, billNumber, billDraftNumber, hearingDate, hearingLocation, deptPosition, introduction, content, closing, testifier, representing, contactEmail, contactPhone };
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
  const { measure, ready } = useTracker(() => {
    const measureSubscription = Measures.subscribeMeasures();
    const rdy = measureSubscription.ready();

    const measureItem = Measures.findOne({ _id: _id }, {});

    return {
      measure: measureItem,
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
      <Container id={PAGE_IDS.MONITORING_REPORT} className="view-bill-container">
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
            <Col>
              <Form>
                <Form.Check
                  type="radio"
                  label="Written Only"
                  name="writeOptions"
                />
                <Form.Check
                  type="radio"
                  label="Written Comments"
                  name="writeOptions"
                />
              </Form>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col className="align-center">
              <ListGroup>
                <ListGroup.Item><strong>Department: </strong>Education </ListGroup.Item>
                <ListGroup.Item><strong>Testifier: </strong> Keith T. Hayashi Interim Superintendent of Education </ListGroup.Item>
                <ListGroup.Item><strong>Title of Bill: </strong> {measure.measureTitle} </ListGroup.Item>
                <ListGroup.Item><strong>Purpose of Bill: </strong> {measure.description} </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mb-5">
            <Form>
              <Form.Group className="mb-2">
                <Form.Check
                  type="radio"
                  label="Support"
                  name="supportOptions"
                />
                <Form.Check
                  type="radio"
                  label="Oppose"
                  name="supportOptions"
                />
                <Form.Check
                  type="radio"
                  label="Comments"
                  name="supportOptions"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <CreateTestimony measureNumber={measure.measureNumber} />
              </Form.Group>
              <Form.Group className="mb-5">
                <Form.Control type="file" className="mb-2" />
                <Alert key="danger" variant="danger">
                  <u>Directions:</u> After completing testimony, identify who to route the testimony to in the field below, then click on <u>Route</u> button.
                </Alert>
              </Form.Group>
              <Form.Group className="mb-2">
                <Alert key="primary" variant="primary">
                  <u>Comments:</u> (Include date & initials)
                </Alert>
                <Form.Control as="textarea" />
              </Form.Group>
              <Form.Group className="mb-2">
                <strong className="text-primary">Route Testimony to:</strong>
                <DropdownButton drop="end" className="mb-2" title="Approval List">
                  <Dropdown.Item>Name 1</Dropdown.Item>
                  <Dropdown.Item>Name 2</Dropdown.Item>
                  <Dropdown.Item>Name 3</Dropdown.Item>
                  <Dropdown.Item>Name 4</Dropdown.Item>
                </DropdownButton>
                <Form.Check label="Testimony same as previous" type="checkbox" clas />
              </Form.Group>
              <Form.Group className="mb-2">
                <Button className="me-2">Route for Office Review</Button>
                <Button variant="secondary">Route to PIPE</Button>
              </Form.Group>
              <Form.Group className="mb-5 text-secondary text-sm">
                Status:
                <Form.Check
                  type="radio"
                  label="Active"
                  name="StatusOptions"
                />
                <Form.Check
                  type="radio"
                  label="Inactive"
                  name="StatusOptions"
                />
                Action: Testimony<br />
                Office: OCID, OITS, OTM, OFS, DEPUTY<br />
                Assigned to: ELB, ELB-DOT<br />
                Action By: CN-Charles Souza/OU-OCID/O*HIDOE*CN-Raymond Fujino/OU-OCID/O*HIDOE<br />
                Secretary: CN-Christol Allen/OU-OCID/O*HIDOE*CN-Saloua Adjir/OU-OCID/O*HIDOE<br />
              </Form.Group>
              <Form.Group>
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Review Section</Accordion.Header>
                    <Accordion.Body>
                      <Form.Control className="mb-2" as="textarea" placeholder="Comments: This will show on disapproval email notice." />
                      <Button className="me-2">Route to Final Approver</Button>
                      <Button variant="danger">Send back to lead office for additional edits</Button>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Approval Section</Accordion.Header>
                    <Accordion.Body className="text-danger">
                      <u>Final Approval Directions</u><br />
                      Review and Edit Testimony as necessary. To reroute back to person change name in <strong>Route testimony to: </strong> field and click on
                      <strong> Save & Route... above.</strong><br />
                      <strong>Final Approval Given</strong> for Supts office below.<br />
                      <Badge bg="primary">Status: New</Badge>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-5">
            <Col>
              <ListGroup variant="flush">
                <ListGroup.Item className="text-secondary">Created by: Brandon Lee/OSIP/HIDOE </ListGroup.Item>
                <ListGroup.Item className="text-secondary">Created on: 08/25/2022 1:48:59</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col>
              <ListGroup variant="flush">
                <ListGroup.Item>Last Edited By:</ListGroup.Item>
                <ListGroup.Item>Date: {`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`} {`${date.getHours()}:${date.getMinutes()}`}</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default MonitoringReport;
