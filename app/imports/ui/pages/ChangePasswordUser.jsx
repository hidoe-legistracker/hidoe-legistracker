import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Navigate } from 'react-router';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';
import { updateMethod } from '../../api/base/BaseCollection.methods';

/**
 * ChangePassword component is similar to signin component, but we change the user's password instead.
 */
const ChangePasswordUser = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);
  const [validated, setValidated] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const userId = Meteor.user() ? Meteor.user().username : '';

  const { user, ready } = useTracker(() => {
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();
    let usr = UserProfiles.findOne({ email: userId });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: userId });
    }
    return {
      user: usr,
      ready: rdy,
    };
  }, []);

  const schema = new SimpleSchema({
    currentPassword: String,
    password: String,
    confirmPassword: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle ChangePassword submission. Change password of corresponding email, then redirect to the home page. */
  const submit = (doc) => {
    const { currentPassword, password, confirmPassword } = doc;
    if (password !== confirmPassword) {
      setError('Password does not match.');
    } else {
      Meteor.loginWithPassword(userId, currentPassword, err => {
        if (!err) {
          setValidated(true);
          setNewPassword(password);
          setOldPassword(currentPassword);
        } else {
          setError(err.reason);
        }
      });
    }
  };
  if (validated) {
    Meteor.call('changePassword', oldPassword, newPassword, err => {
      if (!err) {
        setError('');
        if (ready) {
          if (user.role === ROLE.USER) {
            const collectionName = UserProfiles.getCollectionName();
            const updateData = { id: user._id, newAccount: false };
            updateMethod.callPromise({ collectionName, updateData })
              .catch(errr => swal('Error', errr.message, 'error'))
              .then(() => {
                swal('Success', 'Password updated successfully', 'success');
                setRedirectToRef(true);
              });
          } else {
            const collectionName = AdminProfiles.getCollectionName();
            const updateData = { id: user._id, newAccount: false };
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

  /* Display the change password form. Redirect to directory page after successful password change and login. */
  // if correct authentication, redirect to from: page instead of change password screen
  if (redirectToReferer) {
    return <Navigate to="/directory" />;
  }
  return ready ? (
    <Container id={PAGE_IDS.CHANGE_PASSWORD} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Change your password</h2>
          </Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_CURRENT_PASSWORD} name="currentPassword" placeholder="Current Password" type="password" />
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
  ) : '';
};

export default ChangePasswordUser;
