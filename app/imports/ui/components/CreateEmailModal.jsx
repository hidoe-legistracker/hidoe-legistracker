import React from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Container, Dropdown, DropdownButton, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import swal from 'sweetalert';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { Emails } from '../../api/email/EmailCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';

let newEmail = {
  subject: '',
  recipients: [],
  offices: [],
  ccs: [],
  bccs: [],
  date: '',
  body: '',
};

const offices = [
  { label: 'OCID', value: 'example-list1@mail.com' },
  { label: 'OFO', value: 'example-list2@mail.com' },
  { label: 'OFS', value: 'example-list3@mail.com' },
  { label: 'OHE', value: 'example-list4@mail.com' },
  { label: 'OITS', value: 'example-list5@mail.com' },
  { label: 'OSIP', value: 'example-list6@mail.com' },
  { label: 'OSSS', value: 'example-list7@mail.com' },
  { label: 'OTM', value: 'example-list8@mail.com' },
];

const sampleMail = [
  'Sample 1',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
  'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco ' +
  'laboris nisi ut aliquip ex ea commodo consequat.',
];

const CreateEmailModal = ({ modal, emailItem }) => {
  const { thisUser, users, draftEmail, defaultUsers, defaultCcs, defaultBccs, ready } = useTracker(() => {
    const username = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const emailSubscription = Emails.subscribeEmail();
    const isReady = userSubscription.ready() && adminSubscription.ready() && emailSubscription.ready();

    const usrs = _.sortBy(UserProfiles.find({}, { }).fetch().concat(AdminProfiles.find({}, {}).fetch()), (obj) => obj.lastName);
    const formattedUsers = [];

    let thisUsr = UserProfiles.findOne({ email: username }, {});
    if (thisUsr === undefined) thisUsr = AdminProfiles.findOne({ email: username }, {});

    const findEmail = emailItem !== undefined ? Emails.findOne({ _id: emailItem._id }, {}) : undefined;

    let valid = true;
    if (findEmail === undefined || findEmail.senderEmail !== username) {
      valid = false;
    }

    const ret_email = {
      subject: '',
      recipients: [],
      offices: [],
      ccs: [],
      bccs: [],
      date: '',
      body: '',
    };

    const defaultUsrs = [];
    const defaultCcss = [];
    const defaultBccss = [];

    usrs.forEach(user => {
      formattedUsers.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });

      if (valid) {
        if (findEmail.recipients.indexOf(user.email) >= 0) {
          defaultUsrs.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
          ret_email.recipients.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
        }
        if (findEmail.ccs.indexOf(user.email) >= 0) {
          defaultCcss.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
          ret_email.ccs.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
        }
        if (findEmail.bccs.indexOf(user.email) >= 0) {
          defaultBccss.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
          ret_email.bccs.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
        }
        ret_email.subject = findEmail.subject;
        ret_email.body = findEmail.body;

        newEmail = ret_email;
      }
    });

    return {
      ready: isReady,
      thisUser: thisUsr,
      users: formattedUsers,
      draftEmail: findEmail,
      defaultUsers: defaultUsrs,
      defaultCcs: defaultCcss,
      defaultBccs: defaultBccss,
    };
  }, []);

  const updateEmail = (event, property) => {
    newEmail[property] = event;
  };

  const setMail = (str) => {
    document.getElementById('email-body').value = str;
  };

  const submit = (type) => {
    const { subject, body } = newEmail;
    const recipients = [];
    const ccs = [];
    const bccs = [];
    modal.setShow(false);
    if (subject === '' || newEmail.recipients.length === 0 || body === '') {
      return;
    }

    newEmail.recipients.forEach(recipient => {
      recipients.push(recipient.value);
    });
    newEmail.offices.forEach(office => {
      recipients.push(office.value);
    });
    newEmail.ccs.forEach(cc => {
      ccs.push(cc.value);
    });
    newEmail.bccs.forEach(bcc => {
      bccs.push(bcc.value);
    });

    const senderEmail = thisUser.email;
    const senderName = `${thisUser.firstName} ${thisUser.lastName}`;
    const date = new Date(); // new Date(new Date().toLocaleDateString()).toISOString().substring(0, 10);
    const collectionName = Emails.getCollectionName();

    if (draftEmail === undefined) {
      const definitionData = { subject, senderName, senderEmail, recipients, ccs, bccs, date, body, isDraft: type === 'draft' };
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          if (type === 'draft') {
            swal('Draft Saved', '', 'success');
          } else {
            swal('Success', 'Email Sent!', 'success');
          }
        });
    } else {
      const updateData = { id: emailItem._id, subject, recipients, ccs, bccs, date, body, isDraft: type === 'draft' };
      updateMethod.callPromise({ collectionName, updateData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          if (type === 'draft') {
            swal('Draft Saved', '', 'success');
          } else {
            swal('Success', 'Email Sent!', 'success');
          }
        });
    }
  };

  return ready ? (
    <Modal
      id={COMPONENT_IDS.INBOX_CREATE_EMAIL_MODAL}
      show={modal.show}
      onHide={() => {
        modal.setShow(false);
        setMail('');
      }}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title>New Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <DropdownButton drop="down" title="Template Mails">
            <Dropdown.Item onClick={() => {
              setMail(sampleMail[0]);
              updateEmail(sampleMail[0], 'body');
            }}
            >Template 1
            </Dropdown.Item>
            <Dropdown.Item onClick={() => {
              setMail(sampleMail[1]);
              updateEmail(sampleMail[1], 'body');
            }}
            >Template 2
            </Dropdown.Item>
          </DropdownButton>
          <Form.Group className="offices">
            <Form.Label>Offices: </Form.Label>
            <Select
              id="offices"
              options={offices}
              isMulti
              closeMenuOnSelect={false}
              onChange={(e) => updateEmail(e, 'offices')}
            />
          </Form.Group>
          <Form.Group className="to">
            <Form.Label>To: *</Form.Label>
            <Select
              id="email-to"
              options={users}
              isMulti
              closeMenuOnSelect={false}
              onChange={(e) => updateEmail(e, 'recipients')}
              defaultValue={defaultUsers}
            />
          </Form.Group>
          <Form.Group className="cc">
            <Form.Label>Cc: </Form.Label>
            <Select
              id="email-cc"
              options={users}
              isMulti
              closeMenuOnSelect={false}
              onChange={(e) => updateEmail(e, 'ccs')}
              defaultValue={defaultCcs}
            />
          </Form.Group>
          <Form.Group className="bcc">
            <Form.Label>Bcc: </Form.Label>
            <Select
              id="email-bcc"
              options={users}
              isMulti
              closeMenuOnSelect={false}
              onChange={(e) => updateEmail(e, 'bccs')}
              defaultValue={defaultBccs}
            />
          </Form.Group>
          <Form.Group className="from">
            <Form.Label>From: </Form.Label>
            <Form.Control
              plaintext
              readOnly
              defaultValue={`${thisUser.firstName} ${thisUser.lastName} (${thisUser.email})`}
            />
          </Form.Group>
        </Form>
        <Container>
          <hr />
        </Container>
        <Form>
          <Form.Group className="subject">
            <Form.Label>Subject: </Form.Label>
            <Form.Control
              type="subject"
              placeholder=""
              onChange={(e) => updateEmail(e.target.value, 'subject')}
              defaultValue={draftEmail ? draftEmail.subject : ''}
            />
          </Form.Group>
          <Form.Group className="body">
            <Form.Label>Body: </Form.Label>
            <Form.Control
              id="email-body"
              type="body"
              as="textarea"
              rows={5}
              onChange={(e) => {
                setMail(e.target.value);
                updateEmail(e.target.value, 'body');
              }}
              defaultValue={draftEmail ? draftEmail.body : ''}
            />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label />
            <Form.Control type="file" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={() => {
            submit('draft');
            setMail('');
          }}
          variant="success"
        >Save Draft
        </Button>
        <Button
          type="button"
          onClick={() => {
            submit('send');
            setMail('');
          }}
          variant="primary"
          className="mx-3"
        >Send
        </Button>
      </Modal.Footer>
    </Modal>
  ) : '';

};

CreateEmailModal.propTypes = {
  modal: PropTypes.shape({
    show: PropTypes.bool,
    setShow: PropTypes.func,
  }).isRequired,
  emailItem: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

CreateEmailModal.defaultProps = {
  emailItem: undefined,
};

export default CreateEmailModal;
