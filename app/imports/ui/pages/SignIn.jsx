import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Alert, Card, Container, Row, Col } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SubmitField, TextField } from 'uniforms-bootstrap5';
import { QuestionCircle } from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const SignIn = () => {
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const schema = new SimpleSchema({
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  // Handle Signin submission using Meteor's account mechanism.
  const submit = (doc) => {
    const { email, password } = doc;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setRedirect(true);
      }
    });
  };

  // Render the signin form.
  // if correct authentication, redirect to page instead of login screen
  if (redirect) {
    return (<Navigate to="/directory" />);
  }
  // Otherwise return the Login form.
  return (
    <Container id={PAGE_IDS.SIGN_IN} className="content">
      <Row className="justify-content-center">
        <h2 style={{ textAlign: 'center' }}>Hawai`i State Department of Education Legislative Bill Tracker</h2>
        <h5 style={{ textAlign: 'center' }}>Login to your account to get started</h5>
        <Col xs={6}>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <TextField id={COMPONENT_IDS.SIGN_IN_FORM_EMAIL} name="email" />
                <TextField id={COMPONENT_IDS.SIGN_IN_FORM_PASSWORD} name="password" type="password" />
                <SubmitField id={COMPONENT_IDS.SIGN_IN_FORM_SUBMIT} />
              </Card.Body>
            </Card>
          </AutoForm>
          <Alert variant="secondary">
            <Row>
              <Col xs={1}>
                <QuestionCircle size={45} style={{ margin: 10 }} />
              </Col>
              <Col style={{ marginLeft: 20 }}>
                <Alert.Heading>
                  Need help with your account?
                </Alert.Heading>
                <p>Please contact IT at admin@foo.com for further assistance.</p>
              </Col>
            </Row>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Login was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
