import React, { useState } from 'react';
import { Card, Col, Container, Row, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { AutoForm, ErrorsField, LongTextField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import ConfirmationModal from '../components/ConfirmationModal';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  billNumber: String,
  office: String,
  action: {
    type: String,
    allowedValues: ['Testimony', 'Monitor'],
  },
  status: {
    type: String,
    allowedValues: ['Complete', 'Incomplete'],
    defaultValue: 'Incomplete',
  },
  actNumber: String,
  companion: String,
  reportTitle: String,
  legType: {
    type: String,
    allowedValues: ['Bill'],
    defaultValue: 'Bill',
  },
  committeeReferral: String,
  measureTitle: String,
  introducedBy: String,
  description: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

let submitData = null;
let submitRef = null;

/* Renders the AddStuff page for adding a document. */
const AddBill = () => {

  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  const confirm = (data, formRef) => {
    submitData = data;
    submitRef = formRef;
    modalShow();
  };

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, quantity, condition } = data;
    const owner = Meteor.user().username;
    const collectionName = Stuffs.getCollectionName();
    const definitionData = { name, quantity, condition, owner };
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
            <Col className="text-center"><h1>Create Bill</h1></Col>
            <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => confirm(data, fRef)}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <TextField name="billNumber" label="Bill / Resolution Number" required />
                    </Col>
                    <Col>
                      <TextField name="office" required />
                    </Col>
                    <Col>
                      <SelectField name="action" required />
                    </Col>
                    <Col>
                      <TextField name="actNumber" label="Act Number" />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TextField name="companion" />
                    </Col>
                    <Col>
                      <TextField name="reportTitle" />
                    </Col>
                    <Col>
                      <SelectField name="legType" label="Leg Type" />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TextField name="committeeReferral" />
                    </Col>
                    <Col>
                      <TextField name="measureTitle" label="Measure Title" />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TextField name="introducedBy" label="Introduced By" />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <LongTextField name="description" />
                    </Col>
                  </Row>
                  <SubmitField className="d-flex justify-content-end" value="Create Bill" />
                  <ErrorsField />
                </Card.Body>
              </Card>
            </AutoForm>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={modalClose} centered>
        <ConfirmationModal modal={{ title: 'Create Bill', body: 'Are you sure you want to add this bill to the database?' }} />
        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>Cancel</Button>
          <Button variant="primary" className="btn btn-success" onClick={submitBtn}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddBill;
