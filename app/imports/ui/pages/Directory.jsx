import React, { useState } from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Col, Container, Row, ProgressBar, Form } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import { useTracker } from 'meteor/react-meteor-data';
import Accordion from 'react-bootstrap/Accordion';
import Tab from 'react-bootstrap/Tab';
import _ from 'underscore';
import Tabs from 'react-bootstrap/Tabs';
import { Link, NavLink, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROLE } from '../../api/role/Role';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

const billProgress = 60;

/* Component for layout out a Measures */
const MeasureComponent = ({ measure }) => (
  <Link className="table-row" as={NavLink} exact to={`/view-bill/${measure._id}`}>
    <th scope="row">{measure.measureNumber}</th>
    <td>{`${measure.measureTitle?.substring(0, 100)}`}</td>
    <td>
      {
        measure.description === undefined ? (
          '-'
        ) : `${measure.description?.substring(0, 150)}...`
      }
    </td>
    <td>{measure.currentReferral}</td>
    <td>Testimony/Monitor</td>
    <td>
      <ProgressBar now={billProgress} label={`${billProgress}`} visuallyHidden />
    </td>
  </Link>
);

MeasureComponent.propTypes = {
  measure: PropTypes.shape().isRequired,
};

/* Renders a table containing all of the Measure documents. */
const Directory = () => {
  const [search, setSearch] = useState('');
  const [bills, setBills] = useState();
  const [defaultBills, setDefaultBills] = useState(true);

  const { currentUser, ready, init, measure } = useTracker(() => {
    const username = Meteor.user() ? Meteor.user().username : '';
    let rdy;
    let usr;
    if (Roles.userIsInRole(Meteor.userId(), [ROLE.USER])) {
      const subscription = UserProfiles.subscribe();
      rdy = subscription.ready();
      usr = UserProfiles.findByEmail(username);
    } else {
      const subscription = AdminProfiles.subscribe();
      rdy = subscription.ready();
      usr = AdminProfiles.findByEmail(username);
    }
    const subscription = Measures.subscribeMeasures();
    const isReady = subscription.ready();
    const measureData = Measures.find({}, {}).fetch();
    return {
      currentUser: usr,
      ready: isReady,
      init: rdy,
      measure: measureData,
    };
  }, []);

  if (init && currentUser.newAccount) {
    return (<Navigate to="/change-password-user" />);
  }

  const filter = (office) => {
    if (office === 'ALL BILLS') {
      setDefaultBills(true);
      setBills(measure);
    } else {
      const filteredData = _.where(measure, { currentReferral: office });
      setDefaultBills(false);
      setBills(filteredData);
    }
  };

  const committees = ['JDC', 'WAM', 'CPN', 'HTH', 'HRE', 'LCA', 'PSM', 'EEP', 'CPC', 'FIN', 'AEN', 'JHA', 'WAL', 'WTL', 'AGR', 'ECD', 'LAT',
    'GVO', 'HHH', 'TRN', 'EET', 'HET', 'CMV', 'PSM', 'TRS', 'EDN', 'HWN', 'HMS', 'HOU', 'EDU', 'GVR', 'PDP', 'HSG'];
  const offices = ['OCID', 'OFO', 'OFS', 'OHE', 'OITS', 'OSIP', 'OSSS', 'OTM'];

  return (ready ? (
    <Container id={PAGE_IDS.DIRECTORY} className="py-3" style={{ overflow: 'auto' }}>
      <Row className="justify-content-center">
        <Col className="folder-section">
          <h6 align="center" style={{ marginBottom: 20 }}>Legislative Tracking System 2022</h6>
          <ListGroup style={{ marginBottom: 10 }}>
            <ListGroup.Item action onClick={() => filter('ALL BILLS')} style={{ textAlign: 'center' }}>ALL BILLS</ListGroup.Item>
          </ListGroup>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Offices</Accordion.Header>
              <Accordion.Body>
                <ListGroup defaultActiveKey="#link1" variant="flush">
                  {offices.map((o) => <ListGroup.Item action>{o}</ListGroup.Item>)}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Accordion.Header>Committee's</Accordion.Header>
              <Accordion.Body>
                <ListGroup defaultActiveKey="#link2" variant="flush">
                  {committees.sort().map((c) => <ListGroup.Item action onClick={() => filter(c)}>{c}</ListGroup.Item>)}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col xs={10}>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={event => setSearch(event.target.value)}
            />
          </Form>
          <Tabs defaultActiveKey="all-bills" id="fill-tab-example" className="mb-3" fill>
            <Tab eventKey="all-bills" title="All Bills">
              <Row>
                <Table className="directory-table">
                  <thead style={{ marginBottom: 10 }}>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Bill Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Committees</th>
                      <th scope="col">Actions</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody style={{ overflowY: 'auto' }}>
                    {
                      defaultBills ? (measure.filter(post => {
                        if (search === '') {
                          return post;
                        } if (post.measureNumber && parseInt(post.measureNumber, 10) === parseInt(search, 10)) {
                          return post;
                        } if (post.measureTitle && post.measureTitle.toLowerCase().includes(search.toLowerCase())) {
                          return post;
                        } if (post.description && post.description.toLowerCase().includes(search.toLowerCase())) {
                          return post;
                        } if (post.currentReferral && post.currentReferral.toLowerCase().includes(search.toLowerCase())) {
                          return post;
                        }
                        return undefined;
                      }).map(measures => (
                        <MeasureComponent measure={measures} />
                      ))) :
                        (bills.filter(post => {
                          if (search === '') {
                            return post;
                          } if (post.measureNumber.toInteger() === search) {
                            return post;
                          } if (post.measureTitle && post.measureTitle.toLowerCase().includes(search.toLowerCase())) {
                            return post;
                          } if (post.description && post.description.toLowerCase().includes(search.toLowerCase())) {
                            return post;
                          } if (post.currentReferral && post.currentReferral.toLowerCase().includes(search.toLowerCase())) {
                            return post;
                          }
                          return undefined;
                        }).map(measures => (
                          <MeasureComponent measure={measures} />
                        )))
                    }
                  </tbody>
                </Table>
              </Row>
            </Tab>
            <Tab eventKey="inactive-bills" title="Inactive Bills">
              ...
            </Tab>
            <Tab eventKey="hearings" title="Hearings">
              ...
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Measures" />);
};

export default Directory;
