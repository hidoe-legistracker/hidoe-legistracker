import React, { useState } from 'react';
import _ from 'lodash';
import { Col, Container, Row, Table, InputGroup, Form, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import EmployeeListItem from '../components/EmployeeListItem';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

/* Renders a table containing all of the Employees. Use <EmployeeListItem> to render each row. */
const EmployeeList = () => {
  const [search, setSearch] = useState('');

  const { ready, profiles } = useTracker(() => {
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();

    const user = UserProfiles.find({}, { sort: { username: 1 } }).fetch();
    const admin = AdminProfiles.find({}, { sort: { username: 1 } }).fetch();

    const users = _.sortBy(user.concat(admin), (obj) => obj.lastName);
    return ({
      ready: rdy,
      profiles: users,
    });
  }, []);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  let filteredProfiles;
  let numProfiles;
  let numPages;

  if (ready) {
    filteredProfiles = profiles.filter(post => {
      if (search === '') {
        return post;
      }
      if (post.firstName.toLowerCase().includes(search.toLowerCase())) {
        return post;
      }
      if (post.lastName.toLowerCase().includes(search.toLowerCase())) {
        return post;
      }
      if (post.email.toLowerCase().includes(search.toLowerCase())) {
        return post;
      }
      return undefined;
    });
    numProfiles = _.size(filteredProfiles);
    numPages = parseInt(numProfiles / itemsPerPage, 10);
    if (numProfiles % itemsPerPage !== 0) {
      numPages++;
    }
  }

  const getFilteredProfiles = () => {
    const startIndex = (+currentPage * +itemsPerPage) - +itemsPerPage;
    const endIndex = +startIndex + +itemsPerPage;
    let ret;
    if (endIndex < numProfiles) {
      ret = filteredProfiles.slice(startIndex, endIndex);
    } else {
      ret = filteredProfiles.slice(startIndex, numProfiles);
    }
    return ret;
  };

  // Pagination stuff
  const getItemsPerPage = () => {
    const selection = document.getElementById('pagination-items-per-page').value;
    setItemsPerPage(selection);
    setCurrentPage(1);
    document.getElementById('pagination-select-page').value = 1;
  };
  const getItemsInPage = () => {
    const selection = document.getElementById('pagination-select-page').value;
    setCurrentPage(selection);
  };
  const goToFirstPage = () => {
    document.getElementById('pagination-select-page').value = 1;
    setCurrentPage(1);
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) {
      document.getElementById('pagination-select-page').value = currentPage - 1;
      setCurrentPage(currentPage - 1);
    }
  };
  const goToLastPage = () => {
    document.getElementById('pagination-select-page').value = numPages;
    setCurrentPage(numPages);
  };
  const goToNextPage = () => {
    if (currentPage !== numPages) {
      document.getElementById('pagination-select-page').value = currentPage + 1;
      setCurrentPage(currentPage + 1);
    }
  };
  const handleSearch = (eventText) => {
    document.getElementById('pagination-select-page').value = 1;
    setCurrentPage(1);
    setSearch(eventText);
  };

  return (ready ? (
    <Container id={PAGE_IDS.MEMBERS} className="py-3" style={{ marginTop: '50px' }}>
      <Row>
        <Col>
          <h1 className="montserrat" style={{ textAlign: 'left', fontSize: '3.5em' }}>EMPLOYEE LIST</h1>
        </Col>
        <Col xs={4}>
          <InputGroup className="mb-3" style={{ marginTop: '1em' }}>
            <Form.Control
              placeholder="Search"
              aria-label="Search"
              onChange={event => handleSearch(event.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col>
          <Table striped className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Employee ID</th>
                <th>View Profile</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredProfiles().map((profile, index) => <EmployeeListItem key={index} profile={{ _id: profile._id, name: `${profile.firstName} ${profile.lastName}`, email: profile.email, employeeID: profile.employeeID }} />)}
            </tbody>
          </Table>
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
          {[...Array(numPages)].map((e, i) => <option value={i + 1} key={i}>{i + 1}</option>)}
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
  ) : '');
};

export default EmployeeList;
