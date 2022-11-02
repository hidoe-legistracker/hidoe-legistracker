import React from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import swal from 'sweetalert';
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
  measureRelativeUrl: '',
  code: '',
  officeType: '',
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
  { label: 'OCID' },
  { label: 'OFO' },
  { label: 'OFS' },
  { label: 'OHE' },
  { label: 'OITS' },
  { label: 'OSIP' },
  { label: 'OSSS' },
  { label: 'OTM' },
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
  { label: 'JDC' },
  { label: 'WAM' },
  { label: 'CPN' },
  { label: 'HTH' },
  { label: 'HRE' },
  { label: 'LCA' },
  { label: 'PSM' },
  { label: 'EEP' },
  { label: 'CPC' },
  { label: 'FIN' },
  { label: 'AEN' },
  { label: 'JHA' },
  { label: 'WAL' },
  { label: 'WTL' },
  { label: 'AGR' },
  { label: 'ECD' },
  { label: 'LAT' },
  { label: 'GVO' },
  { label: 'HHH' },
  { label: 'TRN' },
  { label: 'EET' },
  { label: 'HET' },
  { label: 'CMV' },
  { label: 'PSM' },
  { label: 'TRS' },
  { label: 'EDN' },
  { label: 'HWN' },
  { label: 'HMS' },
  { label: 'HOU' },
  { label: 'EDU' },
  { label: 'GVR' },
  { label: 'PDP' },
  { label: 'HSG' },
];

const CreateHearingModal = ({ modal }) => {
  const { thisUser, users, defaultUsers, ready, bills } = useTracker(() => {
    const username = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const measureSubscription = Measures.subscribeMeasuresAdmin();
    const isReady = userSubscription.ready() && adminSubscription.ready() && measureSubscription.ready();

    const usrs = _.sortBy(UserProfiles.find({}, { }).fetch().concat(AdminProfiles.find({}, {}).fetch()), (obj) => obj.lastName);
    const formattedUsers = [];

    let thisUsr = UserProfiles.findOne({ email: username }, {});
    if (thisUsr === undefined) thisUsr = AdminProfiles.findOne({ email: username }, {});

    const defaultUsrs = [];

    usrs.forEach(user => {
      formattedUsers.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
    });

    const measures = Measures.find({}, {}).fetch();

    return {
      ready: isReady,
      thisUser: thisUsr,
      users: formattedUsers,
      defaultUsers: defaultUsrs,
      bills: measures,
    };
  }, []);
  console.log(thisUser);

  const updateHearing = (event, property) => {
    newHearing[property] = event;
  };

  const submit = () => {
    const recipients = [];
    modal.setShow(false);

    newHearing.recipients.forEach(recipient => {
      recipients.push(recipient.value);
    });
    const currentDate = new Date();

    const collectionName = Hearings.getCollectionName();
    const definitionData = {
      year: currentDate.getFullYear(),
      measureType: newHearing.measureType,
      measureNumber: newHearing.measureNumber,
      measureRelativeUrl: newHearing.measureRelativeUrl,
      code: newHearing.code,
      officeType: newHearing.type,
      committee: newHearing.committee,
      datetime: newHearing.datetime,
      description: newHearing.description,
      room: newHearing.room,
      notice: newHearing.notice,
      noticeUrl: newHearing.noticeUrl,
      noticePdfUrl: newHearing.noticePdfUrl,
    };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Email Sent!', 'success');
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
              <Form.Group className="subject">
                <Form.Label>Date & Time </Form.Label>
                <Form.Control
                  type="subject"
                  placeholder="ie. Thursday, February 10, 2022 2:00 pm"
                  onChange={(e) => updateHearing(e.target.value, 'datetime')}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="subject">
                <Form.Label>Location </Form.Label>
                <Form.Control
                  type="subject"
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
                  onChange={(e) => updateHearing(e, 'committee')}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="to">
            <Form.Label>To: *</Form.Label>
            <Select
              id="email-to"
              options={users}
              isMulti
              closeMenuOnSelect={false}
              onChange={(e) => newHearing(e, 'recipients')}
              defaultValue={defaultUsers}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Hearing Type</Form.Label>
            <Select
              id="hearing-type"
              options={types}
              closeMenuOnSelect={false}
              onChange={(e) => newHearing(e, 'measureType')}
              defaultValue={defaultUsers}
            />
          </Form.Group>
        </Form>
        <Form>
          <Form.Group className="subject">
            <Row>
              <Col>
                <Form.Label>Notice URL</Form.Label>
                <Form.Control
                  type="notice-url"
                  placeholder=""
                  onChange={(e) => updateHearing(e.target.value, 'noticeUrl')}
                />
              </Col>
              <Col>
                <Form.Label>Notice PDF URL</Form.Label>
                <Form.Control
                  type="notice-pdf-url"
                  placeholder=""
                  onChange={(e) => updateHearing(e.target.value, 'noticePdfUrl')}
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="body">
            <Form.Label>Add Bills</Form.Label>
            <Select
              id="add-bills"
              isMulti
              options={bills}
              closeMenuOnSelect={false}
              onChange={(e) => updateHearing(e, 'measureNumber')}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Notice Label</Form.Label>
            <Form.Control
              type="notice-label"
              placeholder="ie. HEARING_AEN_FIN_11_01_2022 (HEARING_COMMITTEES_MONTH_DAY_YEAR)"
              onChange={(e) => updateHearing(e.target.value, 'notice')}
            />
          </Form.Group>
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
