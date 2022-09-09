import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Card, Col, Container, Row, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { AutoForm, ErrorsField, LongTextField, SelectField, SubmitField, TextField, DateField, NumField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Measures } from '../../api/measure/MeasureCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import ConfirmationModal from '../components/ConfirmationModal';
import { houseCommittees, senateCommittees } from '../../api/legislature/committees';

const committees = [];
Object.values(houseCommittees).forEach(function (committee) {
  committees.push(`House: ${committee.name}`);
});
Object.values(senateCommittees).forEach(function (committee) {
  committees.push(`Senate: ${committee.name}`);
});

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  year: Number,
  measureType: {
    type: String,
    allowedValues: ['HB', 'SB', 'HR', 'SR', 'HCR', 'SCR', 'GM'],
  },
  measureNumber: Number,
  lastUpdated: { type: Date, optional: true },
  office: {
    type: String,
    allowedValues: committees,
    optional: true,
  },
  action: {
    type: String,
    allowedValues: ['Testimony', 'Monitor'],
  },
  status: { type: String, optional: true },
  actNumber: { type: String, optional: true },
  companion: { type: String, optional: true },
  reportTitle: { type: String, optional: true },
  currentReferral: { type: String, optional: true },
  measureTitle: { type: String, optional: true },
  introducer: { type: String, optional: true },
  description: { type: String, optional: true },
  measurePdfUrl: { type: String, optional: true },
  measureArchiveUrl: { type: String, optional: true },
});

const bridge = new SimpleSchema2Bridge(formSchema);

let submitData = null;
let submitRef = null;

/* Renders the AddStuff page for adding a document. */
const AddMeasure = () => {

  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  const confirm = (data, formRef) => {
    submitData = data;
    submitRef = formRef;

    if (submitData.office.indexOf('House: ') >= 0) {
      const committeeStr = submitData.office.substring(7);
      submitData.office = _.find(houseCommittees, function (committee) { return committee.name === committeeStr; }).key;
    } else {
      const committeeStr = submitData.office.substring(8);
      submitData.office = _.find(senateCommittees, function (committee) { return committee.name === committeeStr; }).key;
    }
    modalShow();
  };

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { year, measureType, measureNumber, office, lastUpdated, code, measurePdfUrl, measureArchiveUrl, measureTitle, reportTitle, bitAppropriation, description, status, introducer, currentReferral, companion } = data;
    const collectionName = Measures.getCollectionName();
    const definitionData = { year, measureType, measureNumber, office, lastUpdated, code, measurePdfUrl, measureArchiveUrl, measureTitle, reportTitle, bitAppropriation, description, status, introducer, currentReferral, companion };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Item added successfully', 'success');
        formRef.reset();
      });
  };

  const submitBtn = () => {
    submit(submitData, submitRef);
    submitData = null;
    submitRef = null;
    modalClose();
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <div>
      <Container id={PAGE_IDS.ADD_BILL} className="py-3">
        <Row className="justify-content-center">
          <Col>
            <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => confirm(data, fRef)}>
              <Card>
                <Card.Body>
                  <Row>
                    <h4>Measure Details</h4>
                  </Row>
                  <Row>
                    <Col>
                      <NumField name="year" label="Year *" required decimal="false" min="1900" />
                    </Col>
                    <Col>
                      <NumField name="measureNumber" label="Measure Number *" required decimal="false" />
                    </Col>
                    <Col>
                      <SelectField name="measureType" label="Measure Type *" required />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TextField name="status" />
                    </Col>
                    <Col>
                      <TextField name="actNumber" label="Act Number" />
                    </Col>
                    <Col>
                      <DateField name="lastUpdated" label="Last Updated" />
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <h4>Titles</h4>
                  </Row>
                  <Row>
                    <Col>
                      <TextField name="measureTitle" label="Measure Title" />
                    </Col>
                    <Col>
                      <TextField name="reportTitle" label="Report Title" />
                    </Col>
                  </Row>

                  <Row>
                    <h4>Assignees</h4>
                  </Row>
                  <Row>
                    <Col>
                      <SelectField name="office" multiple />
                    </Col>
                    <Col>
                      <SelectField name="action" label="Action *" required />
                    </Col>
                  </Row>

                  <Row>
                    <h4>Logistics</h4>
                  </Row>
                  <Row>
                    <Col>
                      <TextField name="companion" />
                    </Col>
                    <Col>
                      <TextField name="currentReferral" label="Referral" />
                    </Col>
                    <Col>
                      <TextField name="introducer" label="Introduced By" />
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <h4>Description</h4>
                  </Row>
                  <Row>
                    <Col>
                      <LongTextField name="description" label="" />
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <h4>Misc</h4>
                  </Row>
                  <Row>
                    <TextField name="measurePdfUrl" label="Measure PDF URL" />
                  </Row>
                  <Row>
                    <TextField name="measureArchiveUrl" label="Measure Archive URL" />
                  </Row>

                  <SubmitField className="d-flex justify-content-end" value="Create Measure" />
                  <ErrorsField />
                </Card.Body>
              </Card>
            </AutoForm>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={modalClose} centered="true">
        <ConfirmationModal modal={{ title: 'Create Measure', body: 'Are you sure you want to add this measure to the database?' }} />
        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>Cancel</Button>
          <Button variant="primary" className="btn btn-success" onClick={submitBtn}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddMeasure;
