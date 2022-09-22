import React from 'react';
import { Col, Container, Row, Nav, ProgressBar } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
import Measure from '../components/Measure';
import LoadingSpinner from '../components/LoadingSpinner';

const billProgress = 60;

/** Component for layout out a Project Card. */
const MeasureComponent = ({ measure }) => (
  <Link className="table-row" to="/view-bill">
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
class Directory extends React.Component {
  renderPage() {
    const projects = _.pluck(Measure.collection.find().fetch(), 'name');
    const projectData = projects.map(project => getProjectData(project));

    return (
      <Container id={PAGE_IDS.DIRECTORY} className="py-3">
        <Row className="justify-content-center">
          <Col className="folder-section">
            <h6 align="center" style={{ marginBottom: 20 }}>Legislative Tracking System 2022</h6>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">BOE</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Deputy</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">OCID</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fourth">OFO</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fifth">OFS</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="sixth">OHE</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="seventh">OITS</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="eighth">OSIP</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ninth">OSSS</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tenth">OTM</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="eleventh">Supt</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col xs={10}>
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
                      {_.map(<MeasureComponent measure={measure} />)}
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
    );
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <LoadingSpinner />;
  }
}

Directory.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub = Meteor.subscribe(Measure.name);
  return {
    ready: sub.ready(),
  };
})(Directory);
