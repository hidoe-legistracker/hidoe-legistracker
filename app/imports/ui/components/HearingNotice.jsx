import React, { useState } from 'react';
import { Col, Container, Row, Breadcrumb, Button, Form } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useTracker } from 'meteor/react-meteor-data';
import { Link, NavLink } from 'react-router-dom';
import _ from 'underscore';
import { useParams } from 'react-router';
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Hearings } from '../../api/hearing/HearingCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from './LoadingSpinner';

const HearingNotice = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const n = useParams();
  // const noticeTitle = _.pluck(n, 'notice');
  const { ready, measure, hearings } = useTracker(() => {
    const hearingSub = Hearings.subscribeHearings();
    const subscription = Measures.subscribeMeasures();

    const measureData = Measures.find({}, {}).fetch();
    const hearingData = Hearings.find({}, {}).fetch();

    const isReady = subscription.ready() && hearingSub.ready();
    return {
      hearings: hearingData,
      ready: isReady,
      measure: measureData,
    };
  }, [n]);

  const filterHearings = _.where(hearings, { notice: n.notice });
  const getHearing = _.first(filterHearings);
  const filteredHearings = [];
  filterHearings.forEach(h => (
    _.where(measure, { measureNumber: h.measureNumber }).forEach(m => {
      filteredHearings.push(m);
    })));
  const numHearings = _.size(filteredHearings);
  let numPages = parseInt(numHearings / itemsPerPage, 10);
  if (numHearings % itemsPerPage !== 0) {
    numPages++;
  }

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
  const getFilteredHearings = () => {
    const startIndex = (+currentPage * +itemsPerPage) - +itemsPerPage;
    const endIndex = +startIndex + +itemsPerPage;
    let ret;
    if (endIndex < numHearings) {
      ret = filteredHearings.slice(startIndex, endIndex);
    } else {
      ret = filteredHearings.slice(startIndex, numHearings);
    }
    return ret;
  };

  return ready ? (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <div>
      <Container>
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item href="/directory">Directory</Breadcrumb.Item>
            <Breadcrumb.Item active>Hearing Notice</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
      </Container>
      <Container id={PAGE_IDS.HEARING_NOTICE} className="view-bill-container" style={{ marginTop: 0 }}>
        <h1>Hearing Notice</h1>
        <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
          <Col>
            <Row style={{ fontWeight: 'bold' }}>Hearing Date & Time</Row>
            <Row>{getHearing.datetime}</Row>
          </Col>
          <Col className="view-bill-columns">
            <Row style={{ fontWeight: 'bold' }}>Hearing Location</Row>
            <Row>{getHearing.room}</Row>
          </Col>
          <Col className="view-bill-columns">
            <Row style={{ fontWeight: 'bold' }}>Hearing Type</Row>
            <Row>{getHearing.measureType}</Row>
          </Col>
        </Row>
        <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
          <Col>
            <Row style={{ fontWeight: 'bold' }}>Office(s)</Row>
            <Row>
              {
                getHearing.committee === undefined ? (
                  '-'
                ) : getHearing.noticeUrl
              }
            </Row>
          </Col>
          <Col>
            <Row style={{ fontWeight: 'bold' }}>Committee(s)</Row>
            <Row>
              {
                getHearing.committee === undefined ? (
                  '-'
                ) : getHearing.committee
              }
            </Row>
          </Col>
        </Row>
        <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
          <Col>
            <Row style={{ fontWeight: 'bold' }}>Notice URL</Row>
            <Row>
              {
                getHearing.noticeUrl === undefined ? (
                  '-'
                ) : getHearing.noticeUrl
              }
            </Row>
          </Col>
          <Col className="view-bill-columns">
            <Row style={{ fontWeight: 'bold' }}>Notice PDF URL</Row>
            <Row>
              {
                getHearing.noticePdfUrl === undefined ? (
                  '-'
                ) : getHearing.noticePdfUrl
              }
            </Row>
          </Col>
        </Row>
        <Container className="view-testimony-container">
          <h3>Bills on Agenda</h3>
          <Table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Code</th>
                <th scope="col">Title</th>
                <th scope="col">Offices</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredHearings().map(m => (
                <Link className="table-row" as={NavLink} exact to={`/view-bill/${m._id}`}>
                  <td>{`${m.measureNumber}`}</td>
                  {/* eslint-disable-next-line consistent-return */}
                  <td>{
                    m.code === undefined ? (
                      '-'
                    ) : `${m.code}`
                  }
                  </td>
                  <td>{`${m.measureTitle?.substring(0, 50)}`}</td>
                  <td>
                    {
                      m.officeType === undefined ? (
                        '-'
                      ) : `${m.officeType?.substring(0, 150)}...`
                    }
                  </td>
                  <td>
                    {
                      m.description === undefined ? (
                        '-'
                      ) : `${m.description?.substring(0, 150)}...`
                    }
                  </td>
                </Link>
              ))}
            </tbody>
          </Table>
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
      </Container>
    </div>
  ) : <LoadingSpinner message="Loading Hearing Notice" />;
};

export default HearingNotice;
