import React from 'react';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Form, Modal, Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import swal from 'sweetalert';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Hearings } from '../../api/hearing/HearingCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import { Emails } from '../../api/email/EmailCollection';

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
  bills: [],
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
  const { users, ready, measures, testimonyWriters } = useTracker(() => {
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const measureSubscription = Measures.subscribeMeasuresAdmin();
    const isReady = userSubscription.ready() && adminSubscription.ready() && measureSubscription.ready();

    const usrs = _.sortBy(UserProfiles.find({}, { }).fetch().concat(AdminProfiles.find({}, {}).fetch()), (obj) => obj.lastName);
    const formattedUsers = [];

    usrs.forEach(user => {
      formattedUsers.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
    });

    const testimonyWritersList = _.sortBy(UserProfiles.find({ position: 'Testimony Writer' }, { }).fetch().concat(AdminProfiles.find({ position: 'Testimony Writer' }, {}).fetch()), (obj) => obj.lastName);

    const measure = Measures.find({}, {}).fetch();

    return {
      ready: isReady,
      users: formattedUsers,
      measures: measure,
      testimonyWriters: testimonyWritersList,
    };
  }, []);

  const updateHearing = (event, property) => {
    newHearing[property] = event;
  };

  const billCard = { marginTop: 15, marginBottom: 15, padding: 20 };

  const billList = [];
  measures.forEach(m => {
    // eslint-disable-next-line no-unused-expressions
    m.description === undefined ? (
      billList.push({ label: `Bill #${m.measureNumber}: (no description)`, value: m.measureNumber })
    ) : billList.push({ label: `Bill #${m.measureNumber}: ${m.description?.substring(0, 125)}...`, value: m.measureNumber });
  });

  const submit = () => {
    let newOfficeType = '';
    let newCommittee = '';
    let bccs = [];
    const { code, datetime, description, room, notice, noticeUrl, noticePdfUrl, bills } = newHearing;

    const testDate = new Date(datetime);
    if (testDate.toString() === 'Invalid Date') {
      swal('Error', 'Invalid Date', 'error');
      return;
    }

    if (bills.length === 0) {
      swal('Error', 'Please select at least one bill for this hearing.', 'error');
      return;
    }

    newHearing.committees.forEach(c => {
      newCommittee += `${c.label} `;
    });
    newHearing.offices.forEach(o => {
      newOfficeType += `${o.label} `;
    });

    let collectionName = Hearings.getCollectionName();
    const date = new Date();
    bills.forEach(b => {
      const some_measure = _.findWhere(measures, { measureNumber: b.value });
      some_measure.emailList.forEach(list => {
        bccs.push(list);
      });
      const definitionData = {
        year: date.getFullYear(), measureType: some_measure.measureType, measureNumber: some_measure.measureNumber, officeType: newOfficeType, measureRelativeUrl: '', code,
        committee: newCommittee, lastUpdated: date.getDay(), timestamp: date.getDay(), datetime, description, room, notice,
        noticeUrl, noticePdfUrl,
      };
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => {
          swal('Error', error.message, 'error');
          throw error;
        });
    });
    swal('Success', 'Hearing successfully created', 'success');

    // Send emails
    let subject = `New Hearing Notification: ${notice}`;
    const senderName = '[NOTIFICATION]';
    const senderEmail = '[NOTIFICATION]';
    const emailDate = new Date();
    let body = `You have a new hearing notification for hearing notice[${notice}] on ${datetime}`;
    newHearing.recipients.forEach(r => {
      bccs.push(r.value);
    });
    bccs = _.uniq(bccs);
    collectionName = Emails.getCollectionName();
    let definitionData = { subject, senderEmail, senderName, recipients: [], bccs, ccs: [], date: emailDate, body, isDraft: false };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'));

    newHearing.offices.forEach(o => {
      const testimonyWriter = _.find(testimonyWriters, function (x) { return _.contains(x.offices, o.label); });
      if (testimonyWriter !== undefined) {
        subject = `New Testimony Writer Task for Hearing: ${notice} for Office: ${o.label}`;
        body = `You have been assigned a new testimony to write for hearing: ${notice}`;
        const recipients = [];
        recipients.push(testimonyWriter.email);
        definitionData = { subject, senderEmail, senderName, recipients, bccs: [], ccs: [], date: emailDate, body, isDraft: false };
        defineMethod.callPromise({ collectionName, definitionData })
          .catch(error => swal('Error', error.message, 'error'));
      }
    });

    modal.setShow(false);
  };

  return ready ? (
    <Modal
      id={COMPONENT_IDS.CREATE_HEARING_MODAL}
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
                <Form.Label>Date & Time</Form.Label>
                <Form.Control
                  placeholder="ie. Thursday, February 10, 2022 2:00 pm"
                  onChange={(e) => updateHearing(e.target.value, 'datetime')}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Location</Form.Label>
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
                <Form.Label>Offices:</Form.Label>
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
                <Form.Label>Committees:</Form.Label>
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
          <div>
            <Card style={billCard}>
              <h4 style={{ textAlign: 'center' }}>Add Bills to Hearing</h4>
              <Row style={{ marginTop: 5, marginBottom: 5 }}>
                <Col>
                  <Select
                    id="bills"
                    options={billList}
                    closeMenuOnSelect={false}
                    isMulti
                    onChange={event => updateHearing(event, 'bills')}
                  />
                </Col>
              </Row>
            </Card>
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
