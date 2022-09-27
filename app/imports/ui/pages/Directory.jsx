import React, { useState } from 'react';
import { Col, Container, Row, Nav, ProgressBar, Form, Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useTracker } from 'meteor/react-meteor-data';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from '../components/LoadingSpinner';

const billProgress = 60;

/* Component for layout out a Measures */
const MeasureComponent = ({ measure }) => (
  <Link className="table-row" as={NavLink} exact to={`/view-bill/${measure._id}`}>
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
  // eslint-disable-next-line react/forbid-prop-types
  measure: PropTypes.object.isRequired,
};

/* Renders a table containing all of the Measure documents. */
const Directory = () => {
  const [search, setSearch] = useState('');
  const [office, setOffice] = useState('');
  console.log(`office: ${office.toLowerCase()}`);

  const { ready, measure } = useTracker(() => {
    const subscription = Measures.subscribeMeasures();
    const isReady = subscription.ready();
    const measureData = Measures.find({}, {}).fetch();
    return {
      ready: isReady,
      measure: measureData,
    };
  }, []);

  return (ready ? (
    <Container id={PAGE_IDS.DIRECTORY} className="py-3" style={{ overflow: 'auto' }}>
      <Row className="justify-content-center">
        <Col className="folder-section">
          <h6 align="center" style={{ marginBottom: 20 }}>Legislative Tracking System 2022</h6>
          <Row>
            <Button onChange={() => setOffice('JDC')} variant="outline-secondary">JDC</Button>
          </Row>
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
                <Table>
                  <thead>
                    <tr>
                      <th scope="col">Bill #</th>
                      <th scope="col">Bill</th>
                      <th scope="col">Description</th>
                      <th scope="col">Offices</th>
                      <th scope="col">Type</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // eslint-disable-next-line array-callback-return,consistent-return
                      measure.filter(post => {
                        if (search === '' || (post.currentReferral.toLowerCase() === '')) {
                          return post;
                        } if (post.measureTitle.toLowerCase().includes(search.toLowerCase()) || (post.currentReferral.toLowerCase().includes(office.toLowerCase()) || office === '')) {
                          return post;
                        } if (post.description.toLowerCase().includes(search.toLowerCase()) || (post.currentReferral.toLowerCase().includes(office.toLowerCase()) || office === '')) {
                          return post;
                        } if (post.currentReferral.toLowerCase().includes(search.toLowerCase()) || (post.currentReferral.toLowerCase().includes(office.toLowerCase()) || office === '')) {
                          return post;
                        }
                      }).map(measures => (
                        <MeasureComponent measure={measures} />
                      ))
                    }
                  </tbody>
                </Table>
              </Row>
            </Tab>
            <Tab eventKey="inactive-bills" title="Inactive Bills">
              ...
            </Tab>
            <Tab eventKey="actions" title="Actions">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Monitor</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Testimony</Nav.Link>
                </Nav.Item>
              </Nav>
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
