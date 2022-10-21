import React from 'react';
import { Col, Container, Row, Breadcrumb } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useTracker } from 'meteor/react-meteor-data';
import { Link, NavLink } from 'react-router-dom';
import _ from 'underscore';
import { useParams } from 'react-router';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Hearings } from '../../api/hearing/HearingCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from './LoadingSpinner';

const HearingNotice = () => {

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
              {filterHearings.map((h) => (
                _.where(measure, { measureNumber: h.measureNumber }).map((m) => (
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
                ))
              ))}
            </tbody>
          </Table>
        </Container>
      </Container>
    </div>
  ) : <LoadingSpinner message="Loading Hearing Notice" />;
};

export default HearingNotice;
