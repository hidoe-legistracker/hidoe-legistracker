import React from 'react';
import { Breadcrumb, Card, Col, Container, Row } from 'react-bootstrap';
import {
  AutoForm,
  DateField,
  ErrorsField,
  LongTextField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

const bridge = new SimpleSchema2Bridge(Testimonies._schema);

/* Renders the EditTestimony page for editing a testimony. */
const EditTestimony = () => {

  const { measureID, testimonyID } = useParams();

  const { doc } = useTracker(() => {
    const subscription = Testimonies.subscribeTestimony();
    const rdy = subscription.ready();
    const document = Testimonies.findOne({ _id: testimonyID });
    return {
      doc: document,
      ready: rdy,
    };
  }, [measureID, testimonyID]);

  // On submit, insert the data.
  const submit = (data) => {
    const { committeeChair, committeeName, billNumber, billDraftNumber, hearingDate, hearingLocation, deptPosition, introduction, content, closing, testifier, representing, contactEmail, contactPhone } = data;
    const collectionName = Testimonies.getCollectionName();
    const updateData = { id: testimonyID, committeeChair, committeeName, billNumber, billDraftNumber, hearingDate, hearingLocation, deptPosition, introduction, content, closing, testifier, representing, contactEmail, contactPhone };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Testimony updated successfully', 'success'));
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  return (
    <div>
      <Container>
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item href="/directory">Home</Breadcrumb.Item>
            <Breadcrumb.Item href={`/view-bill/${measureID}`}>View Bill</Breadcrumb.Item>
            <Breadcrumb.Item href={`/view-testimony/${measureID}&${testimonyID}`}>View Testimony</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Testimony</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
      </Container>
      <Container id={PAGE_IDS.EDIT_TESTIMONY} className="py-3">
        <Row className="justify-content-center">
          <Col>
            <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
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
                      <TextField name="billNumber" label="Bill / Resolution Number *" />
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
                    <SubmitField value="Update Testimony" />
                  </Row>

                  <br />
                  <ErrorsField />
                </Card.Body>
              </Card>
            </AutoForm>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditTestimony;
