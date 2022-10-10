import React from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import Select from 'react-select';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { ROLE } from '../../api/role/Role';
import { houseCommittees, senateCommittees } from '../../api/legislature/committees';

const house = [];
const senate = [];
Object.values(houseCommittees).forEach(function (committee) {
  house.push({ label: `${committee.name}`, value: `${committee.key}`, group: 'HOUSE' });
});
Object.values(senateCommittees).forEach(function (committee) {
  senate.push({ label: `${committee.name}`, value: `${committee.key}`, group: 'SENATE' });
});
const committees = [{
  label: 'House',
  options: house,
}, {
  label: 'Senate',
  options: senate,
}];

const officeNames = ['OCID', 'OFO', 'OFS', 'OHE', 'OITS', 'OSIP', 'OSSS', 'OTM'];
const offices = [];
officeNames.forEach((name) => {
  offices.push({ label: name, value: name });
});

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUp = () => {
  let selectedOffices = [];
  const selectOffices = e => {
    selectedOffices = [];
    e.forEach((x) => {
      selectedOffices.push(x.value);
    });
  };

  let selectedCommittees = [];
  const selectCommittees = e => {
    selectedCommittees = e;
  };

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = () => {
    const doc = {
      firstName: document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_FIRST_NAME).value,
      lastName: document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_LAST_NAME).value,
      email: document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_EMAIL).value,
      password: document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_PASSWORD).value,
      employeeID: document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_EMPLOYEE_ID).value,
      role: document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_ROLE).value,
      newAccount: true,
      offices: selectedOffices,
      committees: selectedCommittees,
    };
    if (doc.firstName === '' || doc.lastName === '' || doc.email === '' || doc.password === '' || doc.employeeID === '') {
      swal('Failed', 'Please fill all required fields', 'error');
      return;
    }
    let collectionName;
    if (doc.role === ROLE.USER) {
      collectionName = UserProfiles.getCollectionName();
    } else {
      collectionName = AdminProfiles.getCollectionName();
    }
    const definitionData = doc;
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'User Registered!', 'success');
        document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_FIRST_NAME).value = '';
        document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_LAST_NAME).value = '';
        document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_EMAIL).value = '';
        document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_PASSWORD).value = '';
        document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_EMPLOYEE_ID).value = '';
        document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_ROLE).value = '';
      });
  };

  const generatePassword = () => {
    let credential = '';
    const maxPasswordLength = 30;
    const minPasswordLength = 6;
    const passwordLength = Math.floor(Math.random() * (maxPasswordLength - (minPasswordLength + 1))) + minPasswordLength;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < passwordLength; i++) {
      credential += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    document.getElementById(COMPONENT_IDS.SIGN_UP_FORM_PASSWORD).value = credential;
    swal('Randomized Password', credential);
  };

  return (
    <Container id={PAGE_IDS.SIGN_UP} className="my-5">
      <h2 className="montserrat">Register New User</h2>
      <hr />
      <Row className="py-2">
        <Form.Label><b>Full Name <span className="text-danger">*</span></b></Form.Label>
        <Col sm={4}>
          <Form.Control id={COMPONENT_IDS.SIGN_UP_FORM_FIRST_NAME} placeholder="First Name" aria-label="First Name" />
          <Form.Text muted>First</Form.Text>
        </Col>
        <Col sm={4}>
          <Form.Control id={COMPONENT_IDS.SIGN_UP_FORM_LAST_NAME} placeholder="Last Name" aria-label="Last Name" />
          <Form.Text muted>Last</Form.Text>
        </Col>
      </Row>
      <Row className="py-2">
        <Col sm={8}>
          <Form.Label><b>E-mail <span className="text-danger">*</span></b></Form.Label>
          <Form.Control id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL} placeholder="E-mail" aria-label="Email" />
        </Col>
      </Row>
      <Row className="py-2">
        <Form.Label><b>Temporary Password <span className="text-danger">*</span></b></Form.Label>
        <Col sm={8}>
          <Form.Control id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD} type="password" placeholder="Temporary Password" aria-label="Temporary Password" />
        </Col>
        <Col>
          <Button className="my-1" size="sm" variant="outline-secondary" onClick={generatePassword}>Generate Password</Button>
        </Col>
      </Row>
      <Row className="py-2">
        <Col sm={8}>
          <Form.Label><b>Employee ID <span className="text-danger">*</span></b></Form.Label>
          <Form.Control id={COMPONENT_IDS.SIGN_UP_FORM_EMPLOYEE_ID} placeholder="Employee ID" aria-label="Employee ID" />
        </Col>
      </Row>
      <Row className="py-2">
        <Col sm={8}>
          <Form.Label><b>Offices</b></Form.Label>
          <Select id={COMPONENT_IDS.SIGN_UP_FORM_OFFICES} options={offices} isMulti closeMenuOnSelect={false} onChange={selectOffices} />
        </Col>
      </Row>
      <Row className="py-2">
        <Col sm={8}>
          <Form.Label><b>Committees</b></Form.Label>
          <Select id={COMPONENT_IDS.SIGN_UP_FORM_COMMITTEES} options={committees} isMulti closeMenuOnSelect={false} onChange={selectCommittees} />
        </Col>
      </Row>
      <Row className="py-2">
        <Col sm={8}>
          <Form.Label><b>User Role <span className="text-danger">*</span></b></Form.Label>
          <Form.Select id={COMPONENT_IDS.SIGN_UP_FORM_ROLE} placeholder="Select Role" aria-label="Role" defaultValue="USER">
            <option>USER</option>
            <option>ADMIN</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="py-4">
        <Col>
          <Button onClick={submit}>Register User</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
