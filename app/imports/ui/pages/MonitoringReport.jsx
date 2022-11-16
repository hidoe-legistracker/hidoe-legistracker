import React from 'react';
import { Container, Row, ListGroup, Col, Form, Breadcrumb, Badge, Alert } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import Countdown from 'react-countdown';
import _ from 'underscore/underscore-node';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import { Measures } from '../../api/measure/MeasureCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import CreateTestimonyModal from '../components/CreateTestimonyModal';
import { Hearings } from '../../api/hearing/HearingCollection';

const MonitoringReport = () => {
  const { _id } = useParams();

  const { measure, ready, testimonies, user, hearings } = useTracker(() => {
    const measureSubscription = Measures.subscribeMeasures();
    const testimonySubscription = Testimonies.subscribeTestimony();
    const hearingSubscription = Hearings.subscribeHearings();
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = measureSubscription.ready() && testimonySubscription.ready() && userSubscription.ready() && adminSubscription.ready() && hearingSubscription.ready();

    const username = Meteor.user() ? Meteor.user().username : '';

    const measureItem = Measures.findOne({ _id: _id }, {});
    const testimonyCollection = Testimonies.find({}, {}).fetch();
    const hearingCollection = Hearings.find({}, {}).fetch();
    let usr = UserProfiles.findOne({ email: username });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: username });
    }
    return {
      measure: measureItem,
      testimonies: testimonyCollection,
      hearings: hearingCollection,
      user: usr,
      ready: rdy,
    };
  }, [_id]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formatDate = (dateString) => {
    const date = dateString.replace(',', '').split(' ');
    const month = months.indexOf(date[0]) + 1;
    const day = date[1];
    const year = date[2];
    return `${month}/${day}/${year}`;
  };
  const getHearingDate = () => {
    const filteredHearings = hearings.filter(hearing => hearing.measureType === measure.measureType && hearing.measureNumber === measure.measureNumber);
    if (filteredHearings.length > 0) {
      const date = filteredHearings[0].datetime.match(/\Bday, ((January|February|March|April|May|June|July|August|September|October|November|December) [0-9]{1,2}, [0-9]{4})/)[1];
      return formatDate(date);
    }
    return '';
  };
  const getHearingTime = () => {
    const filteredHearings = hearings.filter(hearing => hearing.measureType === measure.measureType && hearing.measureNumber === measure.measureNumber);
    if (filteredHearings.length > 0) {
      return filteredHearings[0].datetime.match(/[0-9]{1,2}:[0-9]{1,2} (am|pm)/)[0].replace(' ', '').toUpperCase();
    }
    return '';
  };

  const getHearingLocation = () => {
    const filteredHearings = hearings.filter(hearing => hearing.measureType === measure.measureType && hearing.measureNumber === measure.measureNumber);
    if (filteredHearings.length > 0) {
      return filteredHearings[0].room;
    }
    return '';
  };

  return ready ? (
    <div>
      <Container>
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item href="/directory">Directory</Breadcrumb.Item>
            <Breadcrumb.Item href={`/view-bill/${_id}`}>View Bill</Breadcrumb.Item>
            <Breadcrumb.Item active>Monitoring Report</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
      </Container>
      <Container id={PAGE_IDS.MONITORING_REPORT} className="view-bill-container" style={{ marginTop: 0 }}>
        <Container style={{ padding: 20 }}>
          <Row className="mb-5">
            <Col className="align-left">
              <ListGroup horizontal="sm">
                <ListGroup.Item><strong>Bill #: </strong> {measure.measureNumber} </ListGroup.Item>
                {getHearingDate() ? <ListGroup.Item><strong>Date: </strong> {getHearingDate()} </ListGroup.Item> : ''}
                {getHearingTime() ? <ListGroup.Item><strong>Time: </strong> {getHearingTime()} </ListGroup.Item> : ''}
                {getHearingLocation() ? <ListGroup.Item><strong>Location: </strong> {getHearingLocation()} </ListGroup.Item> : ''}
                <ListGroup.Item><strong>Committee: </strong> {measure.currentReferral} </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col className="align-center">
              <ListGroup>
                <ListGroup.Item><strong>Department: </strong>Education </ListGroup.Item>
                <ListGroup.Item><strong>Offices: </strong> {measure.officeType ? measure.officeType : 'N/A'} </ListGroup.Item>
                <ListGroup.Item><strong>Title of Bill: </strong> {measure.measureTitle} </ListGroup.Item>
                <ListGroup.Item><strong>Purpose of Bill: </strong> {measure.description} </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mb-5">
            <Form>
              <Form.Group className="mb-2">
                <CreateTestimonyModal testimonyDefaultData={{ measureNumber: measure.measureNumber }} />
              </Form.Group>

            </Form>
          </Row>
          <Container className="view-testimony-container">
            {/* eslint-disable-next-line no-nested-ternary */}
            <h3>{_.where(testimonies, { billNumber: measure.measureNumber }).length === 0 ? 'No testimonies available' : user.offices !== undefined && user.offices.length !== 0 ?
              (`Submitted testimonies for ${user.offices.map(office => (` ${office}`))}`) : 'Submitted Testimonies'}
            </h3>
            {_.where(testimonies, { billNumber: measure.measureNumber }).length === 0 ? '' : (
              <Table>
                <thead>
                  <tr>
                    <th scope="col">Hearing Date</th>
                    <th scope="col">Bill #</th>
                    <th scope="col">Prepared By</th>
                    <th scope="col">Office</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {_.where(testimonies, { billNumber: measure.measureNumber }).map(testimony => (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>
                      { testimony.testimonyProgress.length !== 6 && user.offices !== undefined && testimony.office === user.offices.find(element => element === testimony.office) ? (
                        <Link className="table-row" to={`/view-testimony/${measure._id}&${testimony._id}`}>
                          <th scope="row">{getHearingDate() ? <Countdown daysInHours date={getHearingDate()} /> : '-'}</th>
                          <td>{testimony.billNumber}</td>
                          <td>{testimony.testifier}</td>
                          <td>{testimony.office}</td>
                          <td>
                            {testimony.testimonyProgress.length === 6 ? <Badge bg="secondary">Completed</Badge> : ''}
                            {testimony.testimonyProgress.length === 5 ? <Badge bg="primary">Finalizing Testimony</Badge> : ''}
                            {testimony.testimonyProgress.length === 4 ? <Badge bg="warning">Waiting for Final Approval</Badge> : ''}
                            {testimony.testimonyProgress.length === 3 ? <Badge bg="success">Waiting for PIPE Approval</Badge> : ''}
                            {testimony.testimonyProgress.length === 2 ? <Badge bg="primary">Waiting for Office Approval</Badge> : ''}
                            {testimony.testimonyProgress.length === 1 ? <Badge bg="secondary">Testimony being written</Badge> : ''}
                          </td>
                        </Link>
                      )

                        : '' }
                    </>
                  ))}
                </tbody>
              </Table>
            )}
          </Container>
          <Row>
            <Col>
              <Alert variant="light">
                <Alert.Heading>Legend</Alert.Heading>
                <p> <Badge bg="secondary">Testimony being written</Badge><ArrowRight className="ms-2 me-2" />
                  <Badge bg="primary">Waiting for Office Approval</Badge><ArrowRight className="ms-2 me-2" />
                  <Badge bg="success">Waiting for PIPE Approval</Badge><ArrowRight className="ms-2 me-2" />
                  <Badge bg="warning">Waiting for Final Approval</Badge><ArrowRight className="ms-2 me-2" />
                  <Badge bg="primary">Finalizing Testimony</Badge><ArrowRight className="ms-2 me-2" />
                  <Badge bg="secondary">Completed</Badge>
                </p>
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup variant="flush">
                <ListGroup.Item className="text-secondary">Last accessed by: {`${Meteor.user().username}`}</ListGroup.Item>
                {/* eslint-disable-next-line max-len */}
                <ListGroup.Item className="text-secondary">Last updated on:  {`${measure.lastUpdated.getMonth() + 1}/${measure.lastUpdated.getDate()}/${measure.lastUpdated.getFullYear()}`} {`${measure.lastUpdated.getHours()}:${measure.lastUpdated.getMinutes() < 10 ? `0${measure.lastUpdated.getMinutes()}` : measure.lastUpdated.getMinutes()}`}</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default MonitoringReport;
