import React, { useState } from 'react';
import { Col, Container, Row, Nav, ProgressBar, Form } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import { useTracker } from 'meteor/react-meteor-data';
import Tab from 'react-bootstrap/Tab';
import _ from 'underscore';
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
  measure: PropTypes.shape().isRequired,
};

/* Renders a table containing all of the Measure documents. */
const Directory = () => {
  const [search, setSearch] = useState('');
  const [bills, setBills] = useState();
  const [defaultBills, setDefaultBills] = useState(true);

  const { ready, measure } = useTracker(() => {
    const subscription = Measures.subscribeMeasures();
    const isReady = subscription.ready();
    const measureData = Measures.find({}, {}).fetch();
    return {
      ready: isReady,
      measure: measureData,
    };
  }, []);

  const filter = (office) => {
    // setDefaultList(false);
    // console.log(`office: ${office}`);
    const filteredData = _.where(measure, { currentReferral: office });
    // console.log(`filteredData: ${filteredData}`);
    setDefaultBills(false);
    setBills(filteredData);
    console.log(bills);
    /* const filtered = filteredMeasures.map(m => {
      const bill = {};

      bill.bitAppropriation = m.bitAppropriation;
      bill.code = m.code;
      bill.currentReferral = m.currentReferral;
      bill.description = m.description;
      bill.introducer = m.introducer;
      bill.lastUpdated = m.lastUpdated;
      bill.measureArchiveUrl = m.measureArchiveUrl;
      bill.measureNumber = m.measureNumber;
      bill.measurePdfUrl = m.measurePdfUrl;
      bill.measureTitle = m.measureTitle;
      bill.measureType = m.measureType;
      bill.reportTitle = m.reportTitle;
      bill.status = m.status;
      bill.year = m.year;

      console.log(`bill ${bill}`);
      return bill;
    });

    console.log(`filtered ${filtered}`);
     */
    // const filteredMeasures = _.filter(getCurrentReferral, function (m) { return m?.includes(office); });
    // console.log(`filteredMeasures: ${filteredMeasures}`);
  };

  return (ready ? (
    <Container id={PAGE_IDS.DIRECTORY} className="py-3" style={{ overflow: 'auto' }}>
      <Row className="justify-content-center">
        <Col className="folder-section">
          <h6 align="center" style={{ marginBottom: 20 }}>Legislative Tracking System 2022</h6>
          <ListGroup defaultActiveKey="#link1">
            <ListGroup.Item action onClick={() => filter('ALLBILLS')}>ALL BILLS</ListGroup.Item>
            <ListGroup.Item action onClick={() => filter('JDC')}>JDC</ListGroup.Item>
            <ListGroup.Item action onClick={() => filter('WAM')}>WAM</ListGroup.Item>
            <ListGroup.Item action onClick={() => filter('CPN')}>CPN</ListGroup.Item>
          </ListGroup>
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
                      defaultBills ? (measure.filter(post => {
                        if (search === '') {
                          return post;
                        } if (post.measureNumber && post.measureNumber === search.valueOf()) {
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
                          } if (post.measureNumber && post.measureNumber === search.valueOf()) {
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
