import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

const Secretary = () => {

  const { user, ready } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();

    let usr = UserProfiles.findOne({ email: currUser });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: currUser });
    }

    return {
      user: usr,
      ready: rdy,
    };
  });

  // eslint-disable-next-line no-nested-ternary
  return (ready ? (user.position === 'Office Secretary' ? (
    <Container id={PAGE_IDS.SECRETARY} className="py-3">
      <Row className="align-middle text-center">
        <Col xs={4}>
          <Image roundedCircle src="/images/meteor-logo.png" width="150px" />
        </Col>

        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>Welcome to this template</h1>
          <p>Now get to work and modify this app!</p>
        </Col>

      </Row>
    </Container>
  ) : 'Must be a Secretary ') : <h1>Must be a Secretary</h1>);
};

export default Secretary;
