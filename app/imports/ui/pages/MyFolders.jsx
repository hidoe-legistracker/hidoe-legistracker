import React from 'react';
import { Container, ProgressBar, Row, Tab, Col, Nav, Table, Tabs, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Folder, FolderPlus } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROLE } from '../../api/role/Role';

/* Renders a menu folders that has a collection of bills that were bookmarked */

const billProgress = 60;

/* Component for layout out a Measures */
const MeasureComponent = ({ measure }) => (
  <Link className="table-row" as={NavLink} exact to={`/view-bill/${measure.measureId}`}>
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

const MyFolders = () => {

  const { ready, user } = useTracker(() => {
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();
    const username = Meteor.user() ? Meteor.user().username : '';

    let usr = UserProfiles.findOne({ email: username });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: username });
    }

    return ({
      ready: rdy,
      user: usr,
    });
  }, []);

  /** const numFilter = (number) => {
    const filteredData = _.where(measure, { measureNumber: number });
  }; */

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
      title: 'Add Folder',
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

  const removeFolder = (remove) => {
    user.myFolders.splice(remove, 1);
    /*  Remaps position of folders to new index */
    user.myFolders.map((folder, index) => folder.position === index);

    let collectionName;
    if (user.role === ROLE.USER) {
      collectionName = UserProfiles.getCollectionName();
    } else {
      collectionName = AdminProfiles.getCollectionName();
    }
    const updateData = { id: user._id, myFolders: user.myFolders };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Folder deleted', 'success'));
  };

  const MyVerticallyCenteredModal = (props) => (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        { user.myFolders.map((folder) => (
          <Modal.Title id="contained-modal-title-vcenter">{folder.title}</Modal.Title>
        ))}
      </Modal.Header>
      <Modal.Body>
        <Tab.Content>
          { user.myFolders.map((folder, index) => (
            <Tab.Pane eventKey={index}>
              <Col>
                <Tabs defaultActiveKey="all-bills" id="fill-tab-example" className="mb-3" fill>
                  <Tab eventKey="all-bills" title={folder.title}>
                    <Row>
                      <Table>
                        <thead style={{ marginBottom: 10 }}>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Bill Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Offices</th>
                            <th scope="col">Type</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          { folder.listMeasures.map((meas) => <MeasureComponent measure={meas} />) }
                          <Button variant="danger" className="mt-5" onClick={() => removeFolder(index)}>
                            Remove Folder
                          </Button>
                        </tbody>
                      </Table>
                    </Row>
                  </Tab>
                </Tabs>
              </Col>
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Modal.Body>
      <Modal.Footer>
        {/* eslint-disable-next-line react/prop-types,react/destructuring-assignment */}
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );

  const [modalShow, setModalShow] = React.useState(false);

  return (
    ready ? (
      <Container id={PAGE_IDS.MY_FOLDERS}>
        <Button className="mb-3" onClick={getTitle}><FolderPlus size={25} /></Button>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col>
              <Nav variant="pills" className="flex-column">
                {user.myFolders.map((folder, index) => (
                  <Nav.Item><Nav.Link eventKey={index}>{folder.title}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
          </Row>
          <Row xs={1} md={4}>
            { user.myFolders.map((folder, index) => (
              <Row gap={2}>
                <Col>
                  <Card style={{ width: '18rem' }} defaultActiveKey="all-bills" id="fill-tab-example" className="mb-3" fill onClick={() => setModalShow(true)}>
                    <Card.Body eventKey={index}>
                      <Card.Title><Folder size={25} style={{ marginRight: '1em' }} />{folder.title}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ))}
          </Row>
          <Col>
            <Tab.Content>
              { user.myFolders.map((folder, index) => (
                <Tab.Pane eventKey={index}>
                  <Col>
                    <Tabs defaultActiveKey="all-bills" id="fill-tab-example" className="mb-3" fill>
                      <Tab eventKey="all-bills" title={folder.title}>
                        <Row>
                          <Table>
                            <thead style={{ marginBottom: 10 }}>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Bill Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Offices</th>
                                <th scope="col">Type</th>
                                <th scope="col">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              { folder.listMeasures.map((meas) => <MeasureComponent measure={meas} />) }
                              <Button variant="danger" className="mt-5" onClick={() => removeFolder(index)}>
                                Remove Folder
                              </Button>
                            </tbody>
                          </Table>
                        </Row>
                      </Tab>
                    </Tabs>
                  </Col>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>

          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
          />

        </Tab.Container>
      </Container>
    ) : <LoadingSpinner message="Loading Measures" />);

};

export default MyFolders;
