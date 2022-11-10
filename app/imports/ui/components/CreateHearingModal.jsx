import React from 'react';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import swal from 'sweetalert';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Hearings } from '../../api/hearing/HearingCollection';
import { Measures } from '../../api/measure/MeasureCollection';

const newHearing = {
  year: '',
  measureType: '',
  measureNumber: '',
  code: '',
  offices: [],
  committees: [],
  recipients: [],
  committee: '',
  datetime: '',
  description: '',
  room: '',
  notice: '',
  noticeUrl: '',
  noticePdfUrl: '',
};

const offices = [
  { label: 'OCID', value: 'example-list1@mail.com' },
  { label: 'OFO', value: 'example-list2@mail.com' },
  { label: 'OFS', value: 'example-list3@mail.com' },
  { label: 'OHE', value: 'example-list4@mail.com' },
  { label: 'OITS', value: 'example-list5@mail.comv' },
  { label: 'OSIP', value: 'example-list6@mail.comv' },
  { label: 'OSSS', value: 'example-list7@mail.comv' },
  { label: 'OTM', value: 'example-list8@mail.com' },
];

const types = [
  { label: 'hb' },
  { label: 'sb' },
  { label: 'hr' },
  { label: 'sr' },
  { label: 'hcr' },
  { label: 'scr' },
  { label: 'gm' },
];

const committees = [
  { label: 'JDC', value: 'example-list1@mail.com' },
  { label: 'WAM', value: 'example-list2@mail.com' },
  { label: 'CPN', value: 'example-list3@mail.com' },
  { label: 'HTH', value: 'example-list4@mail.com' },
  { label: 'HRE', value: 'example-list5@mail.com' },
  { label: 'LCA', value: 'example-list6@mail.com' },
  { label: 'PSM', value: 'example-list7@mail.com' },
  { label: 'EEP', value: 'example-list8@mail.com' },
  { label: 'CPC', value: 'example-list9@mail.com' },
  { label: 'FIN', value: 'example-list10@mail.com' },
  { label: 'AEN', value: 'example-list11@mail.com' },
  { label: 'JHA', value: 'example-list12@mail.com' },
  { label: 'WAL', value: 'example-list13@mail.com' },
  { label: 'WTL', value: 'example-list14@mail.com' },
  { label: 'AGR', value: 'example-list15@mail.com' },
  { label: 'ECD', value: 'example-list16@mail.com' },
  { label: 'LAT', value: 'example-list17@mail.com' },
  { label: 'GVO', value: 'example-list18@mail.com' },
  { label: 'HHH', value: 'example-list19@mail.com' },
  { label: 'TRN', value: 'example-list20@mail.com' },
  { label: 'EET', value: 'example-list21@mail.com' },
  { label: 'HET', value: 'example-list22@mail.com' },
  { label: 'CMV', value: 'example-list23@mail.com' },
  { label: 'PSM', value: 'example-list24@mail.com' },
  { label: 'TRS', value: 'example-list25@mail.com' },
  { label: 'EDN', value: 'example-list26@mail.com' },
  { label: 'HWN', value: 'example-list27@mail.com' },
  { label: 'HMS', value: 'example-list28@mail.com' },
  { label: 'HOU', value: 'example-list29@mail.com' },
  { label: 'EDU', value: 'example-list30@mail.com' },
  { label: 'GVR', value: 'example-list31@mail.com' },
  { label: 'PDP', value: 'example-list32@mail.com' },
  { label: 'HSG', value: 'example-list33@mail.com' },
];

const CreateHearingModal = ({ modal }) => {
  const { users, ready } = useTracker(() => {
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const measureSubscription = Measures.subscribeMeasuresAdmin();
    const isReady = userSubscription.ready() && adminSubscription.ready() && measureSubscription.ready();

    const usrs = _.sortBy(UserProfiles.find({}, { }).fetch().concat(AdminProfiles.find({}, {}).fetch()), (obj) => obj.lastName);
    const formattedUsers = [];

    usrs.forEach(user => {
      formattedUsers.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
    });

    return {
      ready: isReady,
      users: formattedUsers,
    };
  }, []);

  const updateHearing = (event, property) => {
    newHearing[property] = event;
  };

  const submit = () => {
    let newOfficeType = '';
    let newCommittee = '';
    const { measureType, measureNumber, code, datetime, description, room, notice, noticeUrl, noticePdfUrl } = newHearing;
    modal.setShow(false);

    newHearing.committees.forEach(c => {
      newCommittee += `${c.label} `;
    });
    newHearing.offices.forEach(o => {
      newOfficeType += `${o.label} `;
    });

    const collectionName = Hearings.getCollectionName();
    const definitionData = {
      measureType, measureNumber, code, datetime, description, room, notice, noticeUrl, noticePdfUrl, officeType: newOfficeType, committee: newCommittee,
    };
    console.log(definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Hearing successfully created', 'success');
      });
  };

  return ready ? (
    <Modal
      id={COMPONENT_IDS.INBOX_CREATE_EMAIL_MODAL}
      show={modal.show}
      onHide={() => {
        modal.setShow(false);
      }}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title>New Hearing Notice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Date & Time </Form.Label>
                <Form.Control
                  placeholder="ie. Thursday, February 10, 2022 2:00 pm"
                  onChange={(e) => updateHearing(e.target.value, 'datetime')}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Location </Form.Label>
                <Form.Control
                  placeholder=""
                  onChange={(e) => updateHearing(e.target.value, 'room')}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="offices">
                <Form.Label>Offices: </Form.Label>
                <Select
                  id="offices"
                  options={offices}
                  isMulti
                  closeMenuOnSelect={false}
                  onChange={(e) => updateHearing(e, 'offices')}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="committees">
                <Form.Label>Committees: </Form.Label>
                <Select
                  id="committees"
                  options={committees}
                  isMulti
                  closeMenuOnSelect={false}
                  onChange={(e) => updateHearing(e, 'committees')}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="to">
            <Form.Label>Send Notice To: *</Form.Label>
            <Select
              id="email-to"
              options={users}
              isMulti
              closeMenuOnSelect={false}
              onChange={(e) => updateHearing(e, 'recipients')}
            />
          </Form.Group>
        </Form>
        <Form>
          <Form.Group className="subject">
            <Row>
              <Col>
                <Form.Label>Notice URL</Form.Label>
                <Form.Control
                  placeholder=""
                  onChange={(e) => updateHearing(e.target.value, 'noticeUrl')}
                />
              </Col>
              <Col>
                <Form.Label>Notice PDF URL</Form.Label>
                <Form.Control
                  placeholder=""
                  onChange={(e) => updateHearing(e.target.value, 'noticePdfUrl')}
                />
              </Col>
            </Row>
          </Form.Group>
          <div style={{ borderColor: 'black', borderWidth: '1' }}>
            <h4 style={{ textAlign: 'center' }}>Add Bills to Hearing</h4>
            <Row>
              <Col>
                <Form.Group>
                  <h6>Bill Number</h6>
                  <Form.Control
                    placeholder="Enter a valid bill number (ie. 234)"
                    onChange={(e) => updateHearing(e.target.value, 'measureNumber')}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <h6>Bill Type</h6>
                  <Select
                    id="notice-bill-type"
                    options={types}
                    onChange={(e) => updateHearing(e, 'measureType')}
                  />
                </Form.Group>
              </Col>
              <Col xs={2}>
                <Row>
                  <h6>Add or Remove Bills</h6>
                  <Col>
                    <Button variant="outline-secondary" className="calendar-button">
                      <DashCircle size={25} />
                    </Button>
                  </Col>
                  <Col>
                    <Button variant="outline-secondary" className="calendar-button">
                      <PlusCircle size={25} />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  id="notice-description"
                  placeholder="Enter a description for the hearing notice"
                  onChange={(e) => updateHearing(e.target.value, 'description')}
                />
              </Form.Group>
            </Row>
          </div>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Notice Label</Form.Label>
                <Form.Control
                  type="notice-label"
                  placeholder="ie. HEARING_AEN_FIN_11_01_2022 (HEARING_COMMITTEES_MM_DD_YYYY)"
                  onChange={(e) => updateHearing(e.target.value, 'notice')}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="notice-code"
                  placeholder=""
                  onChange={(e) => updateHearing(e.target.value, 'code')}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="primary"
          className="mx-3"
          onClick={() => submit()}
        >Submit Hearing Notice
        </Button>
      </Modal.Footer>
    </Modal>
  ) : '';

};

CreateHearingModal.propTypes = {
  modal: PropTypes.shape({
    show: PropTypes.bool,
    setShow: PropTypes.func,
  }).isRequired,
};

export default CreateHearingModal;
