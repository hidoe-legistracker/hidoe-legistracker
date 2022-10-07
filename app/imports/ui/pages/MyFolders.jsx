import React from 'react';
import { Container, ProgressBar, Row, Tab, Col, Nav, Table, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';

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
    const collectionName = UserProfiles.getCollectionName();
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
    const folder = user.myFolders.filter(element => element.position !== remove);
    const collectionName = UserProfiles.getCollectionName();
    const updateData = { id: user._id, myFolders: folder };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Folder deleted', 'success'));
  };

  return (
    ready ? (
      <Container id={PAGE_IDS.MY_FOLDERS}>
        <Button className="mb-3" onClick={getTitle}>
          Add Folder
        </Button>
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

        </Tab.Container>
      </Container>
    ) : <LoadingSpinner message="Loading Measures" />);

};

export default MyFolders;
