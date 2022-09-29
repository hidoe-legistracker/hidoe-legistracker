import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { ROLE } from '../../api/role/Role';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUp = () => {
  const schema = new SimpleSchema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    employeeID: String,
    departments: {
      type: Array,
      optional: true,
    },
    'departments.$': String,
    role: {
      type: String,
      allowedValues: [ROLE.USER, ROLE.ADMIN],
    },
    newAccount: {
      type: Boolean,
      defaultValue: true,
    },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc, formRef) => {
    if (doc.role === ROLE.USER) {
      const collectionName = UserProfiles.getCollectionName();
      const definitionData = doc;
      definitionData.newAccount = true;
      // create the new UserProfile
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', 'User Registered!', 'success');
          formRef.reset();
        });
    } else {
      const collectionName = AdminProfiles.getCollectionName();
      const definitionData = doc;
      definitionData.newAccount = true;
      // create the new UserProfile
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', 'User Registered!', 'success');
          formRef.reset();
        });
    }

  };

  let fRef = null;
  return (
    <Container id={PAGE_IDS.SIGN_UP} className="py-3">
      <Row className="justify-content-center">
        <Col xs={7}>
          <Col className="text-center">
            <h2>Register New User</h2>
          </Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_FIRST_NAME} name="firstName" placeholder="First Name" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_LAST_NAME} name="lastName" placeholder="Last Name" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL} name="email" placeholder="E-mail Address" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD} name="password" placeholder="Temporary Password" type="password" label="Temporary Password" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_EMPLOYEE_ID} name="employeeID" placeholder="Employee ID" label="Employee ID" />
                <SelectField id={COMPONENT_IDS.SIGN_UP_FORM_ROLE} name="role" defaultValue={ROLE.USER} />
                <ErrorsField />
                <SubmitField id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} value="Register New User" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
