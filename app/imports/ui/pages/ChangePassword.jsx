import React, { useState } from 'react';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

/**
 * ChangePassword component is similar to signin component, but we change the user's password instead.
 */
const ChangePassword = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const schema = new SimpleSchema({
    email: String,
    password: String,
    confirmPassword: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle ChangePassword submission. Change password of corresponding email, then redirect to the home page. */
  const submit = (doc) => {
    const collectionName = UserProfiles.getCollectionName();
    const definitionData = doc;
    // create the new UserProfile
    defineMethod.callPromise({ collectionName, definitionData })
        .then(() => {
          // log the new user in.
          const { email, password } = doc;
          Meteor.loginWithPassword(email, password, (err) => {
            if (err) {
              setError(err.reason);
            } else {
              setError('');
              setRedirectToRef(true);
            }
          });
        })
        .catch((err) => setError(err.reason));
  };

  /* Display the change password form. Redirect to add page after successful password change and login. */
  // if correct authentication, redirect to from: page instead of change password screen
  if (redirectToReferer) {
    return <Navigate to="/add" />;
  }
  return (
      <Container id={PAGE_IDS.CHANGE_PASSWORD} className="py-3">
        <Row className="justify-content-center">
          <Col xs={5}>
            <Col className="text-center">
              <h2>Change your password</h2>
            </Col>
            <AutoForm schema={bridge} onSubmit={data => submit(data)}>
              <Card>
                <Card.Body>
                  <TextField id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL} name="email" placeholder="E-mail address" />
                  <TextField id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD} name="password" placeholder="New password" type="password" />
                  <TextField id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD} name="confirmPassword" placeholder="Confirm new password" type="password" />
                  <ErrorsField />
                  <SubmitField id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} />
                </Card.Body>
              </Card>
            </AutoForm>
            <Alert variant="secondary">
              Remember your password? Click <Link to="/signin">here</Link>
            </Alert>
            {error === '' ? (
                ''
            ) : (
                <Alert variant="danger">
                  <Alert.Heading>Password change was not successful</Alert.Heading>
                  {error}
                </Alert>
            )}
          </Col>
        </Row>
      </Container>
  );
};

export default ChangePassword;
