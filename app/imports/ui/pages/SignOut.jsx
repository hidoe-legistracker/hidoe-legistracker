import React from 'react';
import { Meteor } from 'meteor/meteor';
import Col from 'react-bootstrap/Col';
import { PAGE_IDS } from '../utilities/PageIDs';

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => {
  Meteor.logout();
  return (
    <Col id={PAGE_IDS.SIGN_OUT} className="content" style={{ textAlign: 'center' }}>
      <h3>Thank you for using the Legislative Bill Tracker</h3>
      <h6>To log back into your account, click the &quot;Login&quot; dropdown</h6>
    </Col>
  );
};

export default SignOut;
