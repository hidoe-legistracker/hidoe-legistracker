import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import Modal from 'react-bootstrap/Modal';
import { AutoForm, DateField, LongTextField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Testimonies } from '../../api/testimony/TestimonyCollection';

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

const CreateTestimonyModal = ({ testimonyDefaultData }) => {
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
    if (parseInt(billNumber, 10) === parseInt(testimonyDefaultData.measureNumber.valueOf(), 10)) {
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
                          <TextField disabled name="billNumber" label="Bill / Resolution Number" defaultValue={testimonyDefaultData.measureNumber} value={testimonyDefaultData.measureNumber} />
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

CreateTestimonyModal.propTypes = {
  testimonyDefaultData: PropTypes.shape({
    measureNumber: PropTypes.number,
  }).isRequired,
};

export default CreateTestimonyModal;
