import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Button, Col, Container, Form, Nav, Row, Tab, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight,
  EnvelopeFill,
  PenFill,
  SendFill,
} from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Emails } from '../../api/email/EmailCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import InboxItem from '../components/InboxItem';
import SentItem from '../components/SentItem';
import DraftItem from '../components/DraftItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import CreateEmailModal from '../components/CreateEmailModal';

const Inbox = () => {
  const { ready, emails, drafts, sent, measures } = useTracker(() => {
    const username = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const emailSubscription = Emails.subscribeEmail();
    const measureSubscription = Measures.subscribeMeasures();
    const isReady = emailSubscription.ready() && measureSubscription.ready() && userSubscription.ready() && adminSubscription.ready();
    const emailData = Emails.find({ recipients: username, isDraft: false }, {}).fetch();
    const ccData = Emails.find({ ccs: username, isDraft: false }, {}).fetch();
    const bccData = Emails.find({ bccs: username, isDraft: false }, {}).fetch();
    const sentData = Emails.find({ senderEmail: username, isDraft: false }, {}).fetch();
    const draftData = Emails.find({ senderEmail: username, isDraft: true }, {}).fetch();
    const measureData = Measures.find({}, {}).fetch();

    const usrs = _.sortBy(UserProfiles.find({}, { }).fetch().concat(AdminProfiles.find({}, {}).fetch()), (obj) => obj.lastName);
    const formattedUsers = [];
    usrs.forEach(user => {
      formattedUsers.push({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user.email });
    });

    let thisUsr = UserProfiles.findOne({ email: username }, {});
    if (thisUsr === undefined) thisUsr = AdminProfiles.findOne({ email: username }, {});

    ccData.forEach(data => {
      if (!_.contains(_.pluck(emailData, '_id'), data._id)) {
        emailData.push(data);
      }
    });
    bccData.forEach(data => {
      if (!_.contains(_.pluck(emailData, '_id'), data._id)) {
        emailData.push(data);
      }
    });
    emailData.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    return {
      ready: isReady,
      emails: emailData,
      drafts: draftData,
      sent: sentData,
      measures: measureData,
    };
  }, []);

  const [show, setShow] = useState(false);
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  let filteredEmails;
  let numEmails;
  let numPages;

  if (ready) {
    if (selectedTab === 'inbox') {
      filteredEmails = emails;
    } else if (selectedTab === 'drafts') {
      filteredEmails = drafts;
    } else {
      filteredEmails = sent;
    }
    numEmails = _.size(filteredEmails);
    numPages = parseInt(numEmails / itemsPerPage, 10);
    if (numEmails % itemsPerPage !== 0) {
      numPages++;
    }
  }

  const getFilteredEmails = () => {
    const startIndex = (+currentPage * +itemsPerPage) - +itemsPerPage;
    const endIndex = +startIndex + +itemsPerPage;
    let ret;
    if (endIndex < numEmails) {
      ret = filteredEmails.slice(startIndex, endIndex);
    } else {
      ret = filteredEmails.slice(startIndex, numEmails);
    }
    return ret;
  };

  // Pagination stuff
  const getItemsPerPage = () => {
    const selection = document.getElementById('pagination-items-per-page').value;
    setItemsPerPage(selection);
    setCurrentPage(1);
    document.getElementById('pagination-select-page').value = 1;
  };
  const getItemsInPage = () => {
    const selection = document.getElementById('pagination-select-page').value;
    setCurrentPage(selection);
  };
  const goToFirstPage = () => {
    document.getElementById('pagination-select-page').value = 1;
    setCurrentPage(1);
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) {
      document.getElementById('pagination-select-page').value = currentPage - 1;
      setCurrentPage(currentPage - 1);
    }
  };
  const goToLastPage = () => {
    document.getElementById('pagination-select-page').value = numPages;
    setCurrentPage(numPages);
  };
  const goToNextPage = () => {
    if (currentPage !== numPages) {
      document.getElementById('pagination-select-page').value = currentPage + 1;
      setCurrentPage(currentPage + 1);
    }
  };
  const handleSelectedTab = (tab) => {
    document.getElementById('pagination-select-page').value = 1;
    setCurrentPage(1);
    setSelectedTab(tab);
  };

  // Get bill number from subject field
  function getBillNumber(subjectField) {
    const string = String(subjectField.toLowerCase().match(/bill.*[0-9]+/));
    return Number(string.match(/[0-9]+/));
  }
  // Get bill number from subject field. Search measures for document with matching bill number. Return _id
  function getBillID(subjectField) {
    const billNumber = getBillNumber(subjectField);
    const index = measures.map(function (measure) { return measure.measureNumber; }).indexOf(billNumber);
    if (index !== -1) {
      return measures[index]._id;
    }
    return '';
  }
  // Check if subject field contains the keyword 'bill' followed by a number
  function checkEmailItem(subjectField) {
    return !!subjectField.toLowerCase().match(/bill.*[0-9]+/);
  }

  return (ready ? (
    <Container id={PAGE_IDS.INBOX} className="py-3">
      <Tab.Container defaultActiveKey="inbox">
        <Row className="justify-content-center">
          <Col className="pt-5">
            <Button id={COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON} size="md" variant="primary" onClick={() => setShow(true)}>
              COMPOSE
            </Button>
            <Nav variant="pills" className="flex-column mt-4">
              <Nav.Link eventKey="inbox" onClick={() => handleSelectedTab('inbox')}><EnvelopeFill size={20} /> Inbox</Nav.Link>
              <Nav.Link eventKey="drafts" onClick={() => handleSelectedTab('drafts')}><PenFill size={20} /> Drafts</Nav.Link>
              <Nav.Link eventKey="sent" onClick={() => handleSelectedTab('sent')}><SendFill size={20} /> Sent</Nav.Link>
            </Nav>
          </Col>
          <Col xs={10}>
            <Tab.Content>
              <Tab.Pane eventKey="inbox">
                <h1 className="text-center montserrat">INBOX</h1>
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col"><Form.Check inline /> </th>
                      <th scope="col">Sender</th>
                      <th scope="col">Subject</th>
                      <th scope="col" className="d-flex flex-row-reverse">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* eslint-disable-next-line max-len */}
                    {getFilteredEmails().map((emailItem, index) => <InboxItem key={index} email={{ _id: emailItem._id, from: emailItem.senderEmail, to: emailItem.recipients.toString(), cc: emailItem.ccs.toString(), subject: emailItem.subject, body: emailItem.body, time: emailItem.date.toISOString(), hasBillReference: checkEmailItem(emailItem.subject), billNumber: getBillNumber(emailItem.subject), billID: getBillID(emailItem.subject), isRead: emailItem.isRead }} />)}
                  </tbody>
                </Table>
              </Tab.Pane>
              <Tab.Pane eventKey="drafts">
                <h1 className="text-center montserrat">DRAFTS</h1>
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col"><Form.Check inline /> </th>
                      <th scope="col">Subject</th>
                      <th scope="col"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredEmails().map((emailItem, index) => <DraftItem key={index} email={{ _id: emailItem._id, subject: emailItem.subject }} />)}
                  </tbody>
                </Table>
              </Tab.Pane>
              <Tab.Pane eventKey="sent">
                <h1 className="text-center montserrat">SENT</h1>
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col"><Form.Check inline /> </th>
                      <th scope="col">Subject</th>
                      <th scope="col" className="d-flex flex-row-reverse">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* eslint-disable-next-line max-len */}
                    {getFilteredEmails().map((emailItem, index) => <SentItem key={index} email={{ _id: emailItem._id, subject: emailItem.subject, to: emailItem.recipients.toString(), cc: emailItem.ccs.toString(), bcc: emailItem.bccs.toString(), body: emailItem.body, time: emailItem.date.toISOString() }} />)}
                  </tbody>
                </Table>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
        <Row className="d-flex flex-row-reverse">
          <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToLastPage}>
            <ChevronDoubleRight />
          </Button>
          <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToNextPage}>
            <ChevronRight />
          </Button>
          <Form.Select id="pagination-select-page" style={{ width: '90px' }} onChange={getItemsInPage}>
            {[...Array(numPages)].map((e, i) => <option value={i + 1} key={i}>{i + 1}</option>)}
          </Form.Select>
          <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToPrevPage}>
            <ChevronLeft />
          </Button>
          <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToFirstPage}>
            <ChevronDoubleLeft />
          </Button>
          <Form.Select id="pagination-items-per-page" style={{ width: '80px', marginRight: '3em' }} onChange={getItemsPerPage}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Form.Select>
          <Form.Label style={{ width: 'fit-content', marginTop: '0.5em', color: 'gray' }}>Items Per Page:</Form.Label>
        </Row>
      </Tab.Container>

      <CreateEmailModal modal={{ show: show, setShow: setShow }} />
    </Container>
  ) : <LoadingSpinner message="Loading Notifications" />);
};

export default Inbox;
