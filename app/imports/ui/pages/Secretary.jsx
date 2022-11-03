import React from 'react';
import { Col, Container, Row, Tab, ListGroup, ProgressBar } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Link, NavLink } from 'react-router-dom';
import _ from 'underscore/underscore-node';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { Measures } from '../../api/measure/MeasureCollection';

const billProgress = 60;

const MeasureComponent = ({ measure }) => (
  <Link className="table-row" as={NavLink} exact to={`/view-bill/${measure.measureId}`}>
    <th scope="row">{measure.measureNumber}</th>
    <td>{measure.measureTitle}</td>
    <td>{measure.description}</td>
    <td>{measure.currentReferral}</td>
    <td>{measure.measureType}</td>
    <td>
      <ProgressBar now={billProgress} label={`${billProgress}`} visuallyHidden />
    </td>
  </Link>
);

MeasureComponent.propTypes = {
  measure: PropTypes.shape().isRequired,
};

const Secretary = () => {

  const { user, ready, measures } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const measureSubscription = Measures.subscribeMeasures();
    const rdy = userSubscription.ready() && adminSubscription.ready() && measureSubscription.ready();

    const measureData = Measures.find({}, {}).fetch();

    let usr = UserProfiles.findOne({ email: currUser });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: currUser });
    }

    return {
      user: usr,
      ready: rdy,
      measures: measureData,
    };
  });

  // {measures.filter(measure => measure.)}

  // eslint-disable-next-line no-nested-ternary
  return (ready ? (user.position === 'Office Secretary' ? (
    <Container id={PAGE_IDS.SECRETARY} className="py-3">
      <Row>
        {user.offices.map(office => (
          <Col sm={4}>
            <ListGroup>
              <ListGroup.Item action href="#key">
                {office}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        ))}
        {user.offices.map(office => (
          <Col sm={8}>
            <Tab.Content>
              {_.where(measures, { measureNumber: 124 }).map(meas => (
                <Tab.Pane eventKey="#key">
                  <MeasureComponent measure={meas} />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        ))}
      </Row>
    </Container>
  ) : 'Must be a Secretary ') : <h1>Must be a Secretary</h1>);
};

export default Secretary;
