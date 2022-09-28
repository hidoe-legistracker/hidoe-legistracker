import React, { useState } from 'react';
import { Navigate } from 'react-router';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { useTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { ROLE } from '../../api/role/Role';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { setPassword } from '../../startup/both/Methods';

/**
 * ChangePassword component is similar to signin component, but we change the user's password instead.
 */
const ChangePasswordUser = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);
  const { ready } = useTracker(() => {
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();
    return {
      ready: rdy,
    };
  }, []);
  const schema = new SimpleSchema({
    email: String,
    password: String,
    confirmPassword: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle ChangePassword submission. Change password of corresponding email, then redirect to the home page. */
  const submit = (doc) => {
    const { email, password, confirmPassword } = doc;
    if (password !== confirmPassword) {
      setError('Password does not match.');
    } else {
      let user = UserProfiles.findOne({ email });
      if (user === undefined) {
        user = AdminProfiles.findOne({ email });
      }
      Meteor.call(setPassword, { userId: user.userID, password: password }, err => {
        if (!err) {
          setError('');
          // swal('Success', 'Password Changed!', 'success');
          if (ready) {
            if (user.role === ROLE.USER) {
              const collectionName = UserProfiles.getCollectionName();
              const updateData = { id: user._id, newAccount: true };
              updateMethod.callPromise({ collectionName, updateData })
                .catch(errr => swal('Error', errr.message, 'error'))
                .then(() => {
                  swal('Success', 'Password updated successfully', 'success');
                  setRedirectToRef(true);
                });
            } else {
              const collectionName = AdminProfiles.getCollectionName();
              const updateData = { id: user._id, newAccount: true };
              updateMethod.callPromise({ collectionName, updateData })
                .catch(errr => swal('Error', errr.message, 'error'))
                .then(() => {
                  swal('Success', 'Password updated successfully', 'success');
                  setRedirectToRef(true);
                });
            }
          }
        }
      });
    }
  };

  /* Display the change password form. Redirect to add page after successful password change and login. */
  // if correct authentication, redirect to from: page instead of change password screen
  if (redirectToReferer) {
    return <Navigate to="/directory" />;
  }
  return (
    <Container id={PAGE_IDS.CHANGE_PASSWORD} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Change Employee&apos;s password</h2>
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

export default ChangePasswordUser;
