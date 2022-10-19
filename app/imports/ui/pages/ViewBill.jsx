import React, { useState } from 'react';
import { Col, Container, Row, Button, Badge, Dropdown, Breadcrumb } from 'react-bootstrap';
import { FileEarmarkText, BookmarkPlus, ArrowLeftRight } from 'react-bootstrap-icons';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import swal from 'sweetalert';
import _ from 'underscore';
import Swal from 'sweetalert2';
import { Roles } from 'meteor/alanning:roles';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { ROLE } from '../../api/role/Role';

const ViewBill = () => {
  const { _id } = useParams();
  const { currentUser, testimonies, measure, ready, user } = useTracker(() => {
    const measureSubscription = Measures.subscribeMeasures();
    const testimonySubscription = Testimonies.subscribeTestimony();
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = measureSubscription.ready() && testimonySubscription.ready() && userSubscription.ready() && adminSubscription.ready();

    const measureItem = Measures.findOne({ _id: _id }, {});
    const testimonyCollection = Testimonies.find({}, {}).fetch();

    const currUser = Meteor.user() ? Meteor.user().username : '';

    const username = Meteor.user() ? Meteor.user().username : '';
    let usr = UserProfiles.findOne({ email: username });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: username });
    }

    return {
      currentUser: currUser,
      testimonies: testimonyCollection,
      measure: measureItem,
      ready: rdy,
      user: usr,
    };
  }, [_id]);

  const addFolder = (folderTitle) => {
    user.myFolders.push({
      title: folderTitle,
      position: user.myFolders.length,
      listMeasures: [],
    });
    let collectionName;
    if (user.role === ROLE.USER) {
      collectionName = UserProfiles.getCollectionName();
    } else {
      collectionName = AdminProfiles.getCollectionName();
    }
    const updateData = { id: user._id, myFolders: user.myFolders };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Folder created', 'success'));
  };

  const getTitle = () => {
    Swal.fire({
      title: 'Create Folder',
      text: 'Name of folder:',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: 'green',
    }).then((result) => {
      if (result.value) {
        addFolder(result.value);
      }
    });
  };

  const addMeasure = (bill, index, measId) => {
    // eslint-disable-next-line no-param-reassign
    bill.measureId = measId;
    const folder = user.myFolders.find(element => element.position === index);
    folder.listMeasures.push(bill);
    let collectionName;
    if (user.role === ROLE.USER) {
      collectionName = UserProfiles.getCollectionName();
    } else {
      collectionName = AdminProfiles.getCollectionName();
    }
    const updateData = { id: user._id, myFolders: user.myFolders };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Measure added', 'success'));
  };

  const [billOffices, setOffices] = useState('');

  const assignOffice = (bill, office) => {
    // eslint-disable-next-line no-param-reassign
    const collectionName = Measures.getCollectionName();
    if (!billOffices.includes(office)) {
      setOffices(`${billOffices} ${office} `);
      const updateData = { id: bill._id, officeType: `${billOffices} ${office} ` };
      updateMethod.callPromise({ collectionName, updateData })
        .catch()
        .then();
    }
  };

  const offices = ['OCID', 'OFO', 'OFS', 'OHE', 'OITS', 'OSIP', 'OSSS', 'OTM'];

  const bill = measure;

  return ready ? (
    <div>
      <Container>
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item href="/directory">Directory</Breadcrumb.Item>
            <Breadcrumb.Item active>View Bill</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
      </Container>
      <Container id={PAGE_IDS.VIEW_BILL} className="view-bill-container" style={{ marginTop: 0 }}>
        <Container>
          <Row>
            <Col>
              <Button variant="secondary">
                <Link as={NavLink} style={{ textDecoration: 'none', color: 'white' }} exact to={`/monitoring-report/${measure._id}`}>
                  <FileEarmarkText style={{ marginRight: '0.5em', marginTop: '-5px' }} />
                  Monitoring Report
                </Link>
              </Button>
              <Dropdown className="float-end">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <BookmarkPlus style={{ marginRight: '0.5em', marginTop: '-5px' }} />
                  Bookmark
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {user.myFolders.map((folder, index) => <Dropdown.Item onClick={() => addMeasure(measure, index, measure._id)}>{folder.title}</Dropdown.Item>)}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => getTitle()}>Create Folder</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {currentUser !== '' && Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
                <Dropdown className="float-end" style={{ marginRight: 5 }}>
                  <Dropdown.Toggle id="dropdown-basic">
                    <ArrowLeftRight style={{ marginRight: '0.5em', marginTop: '-5px' }} />
                    Assign to Office
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {offices.map((officeName) => <Dropdown.Item onClick={() => assignOffice(bill, officeName)}> { officeName } </Dropdown.Item>)}
                  </Dropdown.Menu>
                </Dropdown>
              ) : ''}
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
            <Row>{measure.officeType}</Row>
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
            <Row>{measure.currentReferral}</Row>
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
          <h3>{_.where(testimonies, { billNumber: measure.measureNumber }).length === 0 ? 'No testimonies available' : 'Completed Testimonies'}</h3>
          {_.where(testimonies, { billNumber: measure.measureNumber }).length === 0 ? '' : (
            <Table>
              <thead>
                <tr>
                  <th scope="col">Hearing Date</th>
                  <th scope="col">Bill #</th>
                  <th scope="col">Prepared By</th>
                  <th scope="col">Office</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {_.where(testimonies, { billNumber: measure.measureNumber }).map(testimony => (
                  // eslint-disable-next-line react/jsx-no-useless-fragment
                  <>
                    { testimony.testimonyProgress.length === 6 ? (
                      <Link className="table-row" to={`/view-testimony/${measure._id}&${testimony._id}`}>
                        <th scope="row">{testimony.hearingDate ? testimony.hearingDate.toLocaleDateString() : '-'}</th>
                        <td>{testimony.billNumber}</td>
                        <td>{testimony.testifier}</td>
                        <td>{testimony.office}</td>
                        <td>
                          {testimony.testimonyProgress.length === 6 ? <Badge bg="secondary">Completed</Badge> : ''}
                          {testimony.testimonyProgress.length === 5 ? <Badge bg="primary">Finalizing Testimony</Badge> : ''}
                          {testimony.testimonyProgress.length === 4 ? <Badge bg="warning">Waiting for Final Approval</Badge> : ''}
                          {testimony.testimonyProgress.length === 3 ? <Badge bg="success">Waiting for PIPE Approval</Badge> : ''}
                          {testimony.testimonyProgress.length === 2 ? <Badge bg="primary">Waiting for Office Approval</Badge> : ''}
                          {testimony.testimonyProgress.length === 1 ? <Badge bg="secondary">Testimony being written</Badge> : ''}
                        </td>
                      </Link>
                    )

                      : '' }
                  </>
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
    </div>
  ) : <LoadingSpinner message="Loading Bill Data" />;
};

export default ViewBill;
