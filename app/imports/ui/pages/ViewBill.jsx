import React from 'react';
import { Col, Container, Row, Button, ProgressBar, Dropdown } from 'react-bootstrap';
import { FileEarmarkText, BookmarkPlus } from 'react-bootstrap-icons';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import swal from 'sweetalert';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const billProgress = 60;

const ViewBill = () => {
  const { _id } = useParams();

  const { testimonies, measure, ready, user } = useTracker(() => {
    const measureSubscription = Measures.subscribeMeasures();
    const testimonySubscription = Testimonies.subscribeTestimony();
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = measureSubscription.ready() && testimonySubscription.ready() && userSubscription.ready() && adminSubscription.ready();

    const testimonyCollection = Testimonies.find({}, {}).fetch();
    const measureItem = Measures.findOne({ _id: _id }, {});

    const username = Meteor.user() ? Meteor.user().username : '';
    let usr = UserProfiles.findOne({ email: username });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: username });
    }

    return {
      testimonies: testimonyCollection,
      measure: measureItem,
      ready: rdy,
      user: usr,
    };
  }, [_id]);

  const addMeasure = (bill, index, measId) => {
    // eslint-disable-next-line no-param-reassign
    bill.measureId = measId;
    const folder = user.myFolders.find(element => element.position === index);
    folder.listMeasures.push(bill);
    const collectionName = UserProfiles.getCollectionName();
    const updateData = { id: user._id, myFolders: user.myFolders };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Measure added', 'success'));
  };

  return ready ? (
    <Container id={PAGE_IDS.VIEW_BILL} className="view-bill-container">
      <Container>
        <Row>
          <Col>
            <Button href="/create-testimony" variant="secondary" size="sm" className="bill-button-spacing">
              <FileEarmarkText style={{ marginRight: '0.5em', marginTop: '-5px' }} />
              Create Testimony
            </Button>
            <Button variant="secondary" size="sm" className="bill-button-spacing" href="/monitoringreport">
              <FileEarmarkText style={{ marginRight: '0.5em', marginTop: '-5px' }} />
              Monitoring Report
            </Button>
            <Dropdown className="float-end">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <BookmarkPlus style={{ marginRight: '0.5em', marginTop: '-5px' }} />
                Bookmark
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {user.myFolders.map((folder, index) => <Dropdown.Item onClick={() => addMeasure(measure, index, measure._id)}>{folder.title}</Dropdown.Item>)}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
      <h1>Bill #{measure.measureNumber}</h1>
      <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
        <Col>
          <Row style={{ fontWeight: 'bold' }}>Title</Row>
          <Row>{measure.measureTitle}</Row>
        </Col>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Office</Row>
          <Row>{measure.currentReferral}</Row>
        </Col>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Code</Row>
          <Row>{measure.code}</Row>
        </Col>
      </Row>
      <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
        <Col>
          <Row style={{ fontWeight: 'bold' }}>Bill / Resolution</Row>
          <Row>{measure.description}</Row>
        </Col>
      </Row>
      <Row style={{ alignContent: 'center', justifyContent: 'center', margin: 0 }}>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Report Title</Row>
          <Row>{measure.reportTitle}</Row>
        </Col>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Committee</Row>
          <Row>Conference</Row>
        </Col>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Type</Row>
          <Row>{measure.measureType}</Row>
        </Col>
      </Row>
      <Row style={{ alignContent: 'center', justifyContent: 'center', margin: 0 }}>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Introducer</Row>
          <Row>{measure.introducer}</Row>
        </Col>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Status</Row>
          <Row>{measure.status}</Row>
        </Col>
      </Row>
      <Row style={{ alignContent: 'center', justifyContent: 'center', margin: 0 }}>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>Archive URL</Row>
          <Row>{measure.measureArchiveUrl}</Row>
        </Col>
        <Col className="view-bill-columns">
          <Row style={{ fontWeight: 'bold' }}>PDF URL</Row>
          <Row>{measure.measurePdfUrl}</Row>
        </Col>
      </Row>
      <Container className="view-testimony-container">
        <h3>{testimonies.length === 0 ? 'No testimonies available' : 'Testimonies'}</h3>
        {testimonies.length === 0 ? '' : (
          <Table>
            <thead>
              <tr>
                <th scope="col">Hearing Date</th>
                <th scope="col">Bill #</th>
                <th scope="col">Prepared By</th>
                <th scope="col">DOE Positon</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {testimonies.map(testimony => (
                <Link className="table-row" to={`/view-testimony/${testimony._id}`}>
                  <th scope="row">{testimony.hearingDate ? testimony.hearingDate.toLocaleDateString() : '-'}</th>
                  <td>{testimony.billNumber}</td>
                  <td>{testimony.testifier}</td>
                  <td>{testimony.deptPosition}</td>
                  <td>
                    <ProgressBar now={billProgress} label={`${billProgress}`} visuallyHidden />
                  </td>
                </Link>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      <hr
        style={{
          background: 'black',
          color: 'black',
          borderColor: 'black',
          height: '1px',
        }}
      />
      <Row style={{ marginTop: 10 }}>
        <Form>
          <Form.Check
            inline
            label="I want to receive hearing notifications for this bill"
          />
        </Form>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Data" />;
};

export default ViewBill;
