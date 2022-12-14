import React, { useState } from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Col, Container, Row, ProgressBar, Form, Button } from 'react-bootstrap';
import { ChevronLeft, ChevronDoubleLeft, ChevronRight, ChevronDoubleRight } from 'react-bootstrap-icons';
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
import { useParams } from 'react-router';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROLE } from '../../api/role/Role';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

const billProgress = 60;

/* Component for layout out a Measures */
const MeasureComponent = ({ measure }) => (
  <Link className="table-row" as={NavLink} exact="true" to={`/view-bill/${measure._id}`}>
    <th scope="row">{measure.measureNumber}</th>
    <td>{`${measure.measureTitle?.substring(0, 100)}`}</td>
    <td>
      {
        measure.description === undefined ? (
          '-'
        ) : `${measure.description?.substring(0, 150)}...`
      }
    </td>
    <td>{measure.mainOfficeType}</td>
    <td>{measure.officeType}</td>
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
  const [directoryTab, setDirectoryTab] = useState('Active Bills');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [itemsPerDeadPage, setItemsPerDeadPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDeadPage, setCurrentDeadPage] = useState(1);
  const [search, setSearch] = useState('');
  const [bills, setBills] = useState();
  const [defaultBills, setDefaultBills] = useState(true);

  const { _id } = useParams();

  const { currentUser, ready, init, measure, deadMeasures } = useTracker(() => {
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
    const measureData = Measures.find({ active: true }, {}).fetch();
    const deadMeasureData = Measures.find({ active: false }, {}).fetch();
    if (usr === undefined) usr = AdminProfiles.findOne({ _id: _id }, {});
    return {
      currentUser: usr,
      ready: isReady,
      init: rdy,
      measure: measureData,
      deadMeasures: deadMeasureData,
    };
  }, []);

  // Filter Measures
  let filteredMeasures;
  let filteredDeadMeasures;
  let numMeasures;
  let numDeadMeasures;
  let numPages;
  let numDeadPages;

  if (ready) {
    if (defaultBills) {
      filteredMeasures = measure.filter(post => {
        if (search === '') {
          return post;
        }
        if (post.measureNumber && parseInt(post.measureNumber, 10) === parseInt(search, 10)) {
          return post;
        }
        if (post.measureTitle && post.measureTitle.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.description && post.description.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.mainOfficeType && post.mainOfficeType.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.officeType && post.officeType.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.currentReferral && post.currentReferral.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        return undefined;
      });
    } else {
      filteredMeasures = bills.filter(post => {
        if (search === '') {
          return post;
        }
        if (post.measureNumber && parseInt(post.measureNumber, 10) === parseInt(search, 10)) {
          return post;
        }
        if (post.measureTitle && post.measureTitle.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.description && post.description.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.mainOfficeType && post.mainOfficeType.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.officeType && post.officeType.toLowerCase().includes(search.toLowerCase())) {
          return post;
        } if (post.currentReferral && post.currentReferral.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        return undefined;
      });
    }
    numMeasures = _.size(filteredMeasures);
    numPages = parseInt(numMeasures / itemsPerPage, 10);
    if (numMeasures % itemsPerPage !== 0) {
      numPages++;
    }
  }

  if (ready) {
    if (defaultBills) {
      filteredDeadMeasures = deadMeasures.filter(post => {
        if (search === '') {
          return post;
        }
        if (post.measureNumber && parseInt(post.measureNumber, 10) === parseInt(search, 10)) {
          return post;
        }
        if (post.measureTitle && post.measureTitle.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.description && post.description.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.officeType && post.officeType.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.currentReferral && post.currentReferral.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        return undefined;
      });
    } else {
      filteredDeadMeasures = bills.filter(post => {
        if (search === '') {
          return post;
        }
        if (post.measureNumber && parseInt(post.measureNumber, 10) === parseInt(search, 10)) {
          return post;
        }
        if (post.measureTitle && post.measureTitle.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.description && post.description.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        if (post.officeType && post.officeType.toLowerCase().includes(search.toLowerCase())) {
          return post;
        } if (post.currentReferral && post.currentReferral.toLowerCase().includes(search.toLowerCase())) {
          return post;
        }
        return undefined;
      });
    }
    numDeadMeasures = _.size(filteredDeadMeasures);
    numDeadPages = parseInt(numDeadMeasures / itemsPerDeadPage, 10);
    if (numDeadMeasures % itemsPerDeadPage !== 0) {
      numDeadPages++;
    }
  }

  const getFilteredMeasures = () => {
    const startIndex = (+currentPage * +itemsPerPage) - +itemsPerPage;
    const endIndex = +startIndex + +itemsPerPage;
    let ret;
    if (endIndex < numMeasures) {
      ret = filteredMeasures.slice(startIndex, endIndex);
    } else {
      ret = filteredMeasures.slice(startIndex, numMeasures);
    }
    return ret;
  };

  const getFilteredDeadMeasures = () => {
    const startIndex = (+currentDeadPage * +itemsPerDeadPage) - +itemsPerDeadPage;
    const endIndex = +startIndex + +itemsPerDeadPage;
    let ret;
    if (endIndex < numDeadMeasures) {
      ret = filteredDeadMeasures.slice(startIndex, endIndex);
    } else {
      ret = filteredDeadMeasures.slice(startIndex, numMeasures);
    }
    return ret;
  };

  if (init && currentUser.newAccount) {
    return (<Navigate to="/change-password-user" />);
  }

  // Pagination stuff
  const getNumPages = () => {
    if (directoryTab === 'Active Bills') return [...Array(numPages)];
    if (directoryTab === 'Inactive Bills') return [...Array(numDeadPages)];
    return [];
  };

  const getItemsPerPage = () => {
    const selection = document.getElementById('pagination-items-per-page').value;
    if (directoryTab === 'Active Bills') {
      setItemsPerPage(selection);
      setCurrentPage(1);
    }
    if (directoryTab === 'Inactive Bills') {
      setItemsPerDeadPage(selection);
      setCurrentDeadPage(1);
    }
    document.getElementById('pagination-select-page').value = 1;
  };
  const getItemsInPage = () => {
    const selection = document.getElementById('pagination-select-page').value;
    if (directoryTab === 'Active Bills') {
      setCurrentPage(selection);
    }
    if (directoryTab === 'Inactive Bills') {
      setCurrentDeadPage(selection);
    }
  };
  const goToFirstPage = () => {
    document.getElementById('pagination-select-page').value = 1;
    if (directoryTab === 'Active Bills') {
      setCurrentPage(1);
    }
    if (directoryTab === 'Inactive Bills') {
      setCurrentDeadPage(1);
    }
  };
  const goToPrevPage = () => {
    if (directoryTab === 'Active Bills' && currentPage !== 1) {
      document.getElementById('pagination-select-page').value = currentPage - 1;
      setCurrentPage(currentPage - 1);
    }
    if (directoryTab === 'Inactive Bills' && currentDeadPage !== 1) {
      document.getElementById('pagination-select-page').value = currentDeadPage - 1;
      setCurrentDeadPage(currentDeadPage - 1);
    }
  };
  const goToLastPage = () => {
    if (directoryTab === 'Active Bills') {
      setCurrentPage(numPages);
      document.getElementById('pagination-select-page').value = numPages;
    }
    if (directoryTab === 'Inactive Bills') {
      setCurrentDeadPage(numDeadPages);
      document.getElementById('pagination-select-page').value = numDeadPages;
    }
  };
  const goToNextPage = () => {
    if (directoryTab === 'Active Bills' && currentPage < numPages) {
      document.getElementById('pagination-select-page').value = currentPage + 1;
      setCurrentPage(currentPage + 1);
    }
    if (directoryTab === 'Inactive Bills' && currentDeadPage < numDeadPages) {
      document.getElementById('pagination-select-page').value = currentDeadPage + 1;
      setCurrentDeadPage(currentDeadPage + 1);
    }
  };
  const handleSearch = (eventText) => {
    document.getElementById('pagination-select-page').value = 1;
    setCurrentPage(1);
    setCurrentDeadPage(1);
    setSearch(eventText);
  };

  const filter = (committee) => {
    if (committee === 'ALL BILLS') {
      setDefaultBills(true);
      setBills(measure);
    } else {
      const filteredData = [];
      measure.forEach((m) => {
        if (m.currentReferral && m.currentReferral.indexOf(committee) >= 0) {
          filteredData.push(m);
        }
      });
      setDefaultBills(false);
      setBills(filteredData);
    }
  };

  const committees = ['JDC', 'WAM', 'CPN', 'HTH', 'HRE', 'LCA', 'PSM', 'EEP', 'CPC', 'FIN', 'AEN', 'JHA', 'WAL', 'WTL', 'AGR', 'ECD', 'LAT',
    'GVO', 'HHH', 'TRN', 'EET', 'HET', 'CMV', 'PSM', 'TRS', 'EDN', 'HWN', 'HMS', 'HOU', 'EDU', 'GVR', 'PDP', 'HSG'];
  const offices = ['OCID', 'OFO', 'OFS', 'OHE', 'OITS', 'OSIP', 'OSSS', 'OTM'];

  const filterOffices = (office) => {
    if (office === 'ALL BILLS') {
      setDefaultBills(true);
      setBills(measure);
    } else if (office === 'MY BILLS') {
      const filteredData = [];
      const officeCheck = [];
      currentUser.offices.forEach((item) => {
        if (item && item.indexOf(item) >= 0) {
          officeCheck.push(item);
        }
      });
      currentUser.offices.forEach((item) => {
        measure.forEach(x => {
          if (x.officeType && x.officeType.indexOf(item) >= 0) {
            filteredData.push(x);
          }
        });
      });
      currentUser.offices.forEach((item) => {
        measure.forEach(x => {
          if (x.mainOfficeType && x.mainOfficeType.indexOf(item) >= 0) {
            filteredData.push(x);
          }
        });
      });
      const noDup = [];
      filteredData.forEach(element => {
        if (!noDup.includes(element)) {
          noDup.push(element);
        }
      });
      setDefaultBills(false);
      setBills(noDup);
    } else {
      const filteredData = [];
      measure.forEach((item) => {
        if (item.officeType && item.officeType.indexOf(office) >= 0) {
          filteredData.push(item);
        }
      });
      measure.forEach((item) => {
        if (item.mainOfficeType && item.mainOfficeType.indexOf(office) >= 0) {
          filteredData.push(item);
        }
      });
      setDefaultBills(false);
      setBills(filteredData);
    }
  };

  return (ready ? (
    <Container id={PAGE_IDS.DIRECTORY} className="py-3" style={{ overflow: 'auto' }}>
      <Row className="justify-content-center">
        <Col className="folder-section">
          <h6 align="center" style={{ marginBottom: 20 }}>Legislative Tracking System 2022</h6>
          <ListGroup style={{ marginBottom: 10 }}>
            <ListGroup.Item action onClick={() => filter('ALL BILLS')} style={{ textAlign: 'center' }}>ALL BILLS</ListGroup.Item>
          </ListGroup>
          <ListGroup style={{ marginBottom: 10 }}>
            <ListGroup.Item action onClick={() => filterOffices('MY BILLS')} style={{ textAlign: 'center' }}>MY BILLS</ListGroup.Item>
          </ListGroup>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Offices</Accordion.Header>
              <Accordion.Body>
                <ListGroup defaultActiveKey="#link1" variant="flush">
                  {offices.map((o, key) => <ListGroup.Item action key={key} onClick={() => filterOffices(o)}>{o}</ListGroup.Item>)}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Accordion.Header>Committee's</Accordion.Header>
              <Accordion.Body>
                <ListGroup defaultActiveKey="#link2" variant="flush">
                  {committees.sort().map((c, key) => <ListGroup.Item action key={key} onClick={() => filter(c)}>{c}</ListGroup.Item>)}
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
              onChange={event => handleSearch(event.target.value)}
            />
          </Form>
          <Tabs
            defaultActiveKey="all-bills"
            id="fill-tab-example"
            className="mb-3"
            fill
            onClick={(e) => {
              setDirectoryTab(e.target.innerHTML);
              setCurrentPage(1);
              setCurrentDeadPage(1);
              setItemsPerPage(10);
              setItemsPerDeadPage(10);
              document.getElementById('pagination-items-per-page').value = 10;
            }}
          >
            <Tab eventKey="all-bills" title="Active Bills">
              <Row>
                <Table className="directory-table">
                  <thead style={{ marginBottom: 10 }}>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Bill Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Main Office</th>
                      <th scope="col">Supporting Offices</th>
                      <th scope="col">Committees</th>
                      <th scope="col">Actions</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody style={{ position: 'relative' }}>
                    {
                      getFilteredMeasures().map((measures, key) => (
                        <MeasureComponent measure={measures} key={key} />
                      ))
                    }
                  </tbody>
                </Table>
              </Row>
            </Tab>
            <Tab eventKey="inactive-bills" title="Inactive Bills">
              <Row>
                <Table className="directory-table">
                  <thead style={{ marginBottom: 10 }}>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Bill Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Main Office</th>
                      <th scope="col">Offices</th>
                      <th scope="col">Committees</th>
                      <th scope="col">Actions</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody style={{ position: 'relative' }}>
                    {
                      getFilteredDeadMeasures().map((measures, key) => (
                        <MeasureComponent measure={measures} key={key} />
                      ))
                    }
                  </tbody>
                </Table>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <Row className="d-flex flex-row-reverse">
        <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToLastPage}>
          <ChevronDoubleRight />
        </Button>
        <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToNextPage}>
          <ChevronRight />
        </Button>
        <Form.Select id="pagination-select-page" style={{ width: '90px' }} onChange={getItemsInPage}>
          {getNumPages().map((e, i) => <option value={i + 1} key={i}>{i + 1}</option>)}
        </Form.Select>
        <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToPrevPage}>
          <ChevronLeft />
        </Button>
        <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToFirstPage}>
          <ChevronDoubleLeft />
        </Button>
        <Form.Select id="pagination-items-per-page" style={{ width: '80px', marginRight: '3em' }} onChange={getItemsPerPage}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </Form.Select>
        <Form.Label style={{ width: 'fit-content', marginTop: '0.5em', color: 'gray' }}>Items Per Page:</Form.Label>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Measures" />);
};

export default Directory;
