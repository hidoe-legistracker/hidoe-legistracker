import React, { useState } from 'react';
import _ from 'underscore';
import { Link, NavLink } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { Hearings } from '../../api/hearing/HearingCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from '../components/LoadingSpinner';

const HearingPage = () => {
  const [itemsPerHearingPage, setItemsPerHearingPage] = useState(10);
  const [currentHearingPage, setCurrentHearingPage] = useState(1);

  const { ready, hearings } = useTracker(() => {
    const hearingSub = Hearings.subscribeHearings();
    const subscription = Measures.subscribeMeasures();
    const isReady = subscription.ready() && hearingSub.ready();
    const hearingData = Hearings.find({}, {}).fetch();
    return {
      hearings: hearingData,
      ready: isReady,
    };
  }, []);

  let numHearings;
  let numHearingPages;

  const getHearings = _.uniq(hearings, false, (hearing) => hearing.notice);

  if (ready) {
    numHearings = _.size(getHearings);
    numHearingPages = parseInt(numHearings / itemsPerHearingPage, 10);
    if (numHearings % itemsPerHearingPage !== 0) {
      numHearingPages++;
    }
  }

  const getNumPages = () => [...Array(numHearingPages)];

  const getItemsPerPage = () => {
    const selection = document.getElementById('pagination-items-per-page').value;
    setItemsPerHearingPage(selection);
    setCurrentHearingPage(1);
    document.getElementById('pagination-select-page').value = 1;
  };
  const getItemsInPage = () => {
    const selection = document.getElementById('pagination-select-page').value;
    setCurrentHearingPage(selection);
  };
  const goToFirstPage = () => {
    document.getElementById('pagination-select-page').value = 1;
    setCurrentHearingPage(1);
  };
  const goToPrevPage = () => {
    if (currentHearingPage !== 1) {
      document.getElementById('pagination-select-page').value = currentHearingPage - 1;
      setCurrentHearingPage(currentHearingPage - 1);
    }
  };
  const goToLastPage = () => {
    setCurrentHearingPage(numHearingPages);
    document.getElementById('pagination-select-page').value = numHearingPages;
  };
  const goToNextPage = () => {
    if (currentHearingPage < numHearingPages) {
      document.getElementById('pagination-select-page').value = currentHearingPage + 1;
      setCurrentHearingPage(currentHearingPage + 1);
    }
  };

  const getFilteredHearings = () => {
    const startIndex = (+currentHearingPage * +itemsPerHearingPage) - +itemsPerHearingPage;
    const endIndex = +startIndex + +itemsPerHearingPage;
    let ret;
    if (endIndex < numHearings) {
      ret = getHearings.slice(startIndex, endIndex);
    } else {
      ret = getHearings.slice(startIndex, numHearings);
    }
    return ret;
  };

  return (ready ? (
    <Container>
      <Table className="directory-table" striped>
        <thead style={{ marginBottom: 10 }}>
          <tr>
            <th scope="col">Date/Time</th>
            <th scope="col">Location</th>
            <th scope="col">Notice ID</th>
          </tr>
        </thead>
        <tbody style={{ position: 'relative' }}>
          {getFilteredHearings().map(
            (hearing, key) => (
              <Link className="table-row" style={{ border: 'none' }} as={NavLink} exact="true" to={`/hearing-notice/${hearing.notice}`} key={key}>
                <td>
                  {hearing.datetime}
                </td>
                <td>
                  {hearing.room}
                </td>
                <td>
                  {hearing.notice}
                </td>
              </Link>
            ),
          )}
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

  ) : <LoadingSpinner message="Loading Hearing Notices" />);
};

export default HearingPage;
