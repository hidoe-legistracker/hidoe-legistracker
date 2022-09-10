import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import {
  AutoForm,
  DateField,
  ErrorsField,
  LongTextField, SelectField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

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
  position: {
    type: String,
    allowedValues: ['In Support', 'In Opposition'],
  },
  introduction: String,
  content: String,
  closing: {
    type: String,
    optional: true,
  },
  writtenBy: String,
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

/* Renders the AddStuff page for adding a document. */
const AddTestimony = () => {

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

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container id={PAGE_IDS.ADD_STUFF} className="py-3">
      <Row className="justify-content-center">
        <Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <h4>Address To</h4>
                <Row>
                  <Col>
                    <TextField name="committeeChair" label="Committee Chair *" />
                  </Col>
                  <Col>
                    <TextField name="committeeName" label="Committee Name *" />
                  </Col>
                </Row>

                <h4>Bill / Resolution Information</h4>
                <Row>
                  <Col>
                    <TextField name="billNumber" label="Bill / Resolution Number *" />
                  </Col>
                  <Col>
                    <TextField name="billDraftNumber" label="Draft Number" />
                  </Col>
                </Row>

                <h4>Hearing Information</h4>
                <Row>
                  <Col>
                    <DateField name="hearingDate" label="Hearing Date" />
                  </Col>
                  <Col>
                    <TextField name="hearingLocation" label="Hearing Location" />
                  </Col>
                </Row>

                <br />
                <h4>Testimony</h4>
                <Row>
                  <Col>
                    <SelectField name="position" label="Position *" />
                  </Col>
                  <Col />
                </Row>
                <LongTextField name="introduction" label="Introduction *" />
                <ul>
                  <li>Introduce who you are and/or the group or organization you represent</li>
                  <li>State your position on the measure (&quot;I am testifying in favor of…&quot; or &quot;I am testifying against…&quot;)</li>
                </ul>
                <LongTextField name="content" label="Content *" />
                <ul>
                  <li>Reasons for taking your position</li>
                  <li>Start with most important or compelling</li>
                  <li>Include facts, figures, experiences, or narratives to support your position</li>
                </ul>
                <LongTextField name="closing" label="Closing" />
                <ul>
                  <li>Include any summary remarks and re-state your position</li>
                </ul>

                <br />
                <h4>Affiliations</h4>
                <TextField name="representing" label="Name any groups you are representing here:" />

                <br />
                <h4>Contact Information</h4>
                <TextField name="writtenBy" label="Your Name (First, Last) *" />
                <Row>
                  <Col>
                    <TextField name="contactPhone" label="Phone" />
                  </Col>
                  <Col>
                    <TextField name="contactEmail" label="Email" />
                  </Col>
                </Row>

                <SubmitField value="Submit Testimony" />

                <br />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AddTestimony;
