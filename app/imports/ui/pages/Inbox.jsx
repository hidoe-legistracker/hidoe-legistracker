import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Trash } from 'react-bootstrap-icons';
import Table from 'react-bootstrap/Table';
import { PAGE_IDS } from '../utilities/PageIDs';

// import InboxItem from '../components/InboxItem';
// import Button from 'react-bootstrap/Button'; * */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
class Inbox extends React.Component {
  constructor(args) {
    super(args);

    // Assign unique IDs to the emails
    const { emails } = this.props;
    let id = 0;
    for (const email of emails) {
      email.id = id++;
    }

    this.state = {
      selectedEmailId: 0,
      currentSection: 'inbox',
      emails,
    };
  }

  setSidebarSection(section) {
    let { selectedEmailId } = this.state;
    const { currentSection } = this.state;
    if (section !== { currentSection }) {
      selectedEmailId = '';
    }

    this.setState({
      currentSection: section,
      selectedEmailId,
    });
  }

  deleteMessage(id) {
    // Mark the message as 'deleted'
    const { emails } = this.state;
    const { currentSection } = this.state;
    const index = emails.findIndex(x => x.id === id);
    emails[index].tag = 'deleted';

    // Select the next message in the list
    let selectedEmailId = '';
    for (const email of emails) {
      if (email.tag === { currentSection }) {
        selectedEmailId = email.id;
        break;
      }
    }

    this.setState({
      emails,
      selectedEmailId,
    });
  }

  openEmail(id) {
    const { emails } = this.state;
    const index = emails.findIndex(x => x.id === id);
    emails[index].read = 'true';
    this.setState({
      selectedEmailId: id,
      emails,
    });
  }

  render() {
    const { emails } = this.state;
    const { selectedEmailId } = this.state;
    const { currentSection } = this.state;

    const currentEmail = { emails }.find(x => x.id === { selectedEmailId });
    return (
      <div>
        <Sidebar
          emails={emails}
          setSidebarSection={(section) => { this.setSidebarSection(section); }}
        />
        <div className="inbox-container">
          <EmailList
            emails={{ emails }.filter(x => x.tag === { currentSection })}
            onEmailSelected={(id) => { this.openEmail(id); }}
            selectedEmailId={selectedEmailId}
            currentSection={currentSection}
          />
          <EmailDetails
            email={currentEmail}
            onDelete={(id) => { this.deleteMessage(id); }}
          />
        </div>
      </div>
    );
  }
}
// Helper methods
const getPrettyDate = (date) => {
  date = date.split(' ')[0];
  const newDate = date.split('-');
  const month = months[0];
  return `${month} ${newDate[2]}, ${newDate[0]}`;
};

// Remove the seconds from the time
const getPrettyTime = (date) => {
  const time = date.split(' ')[1].split(':');
  return `${time[0]}:${time[1]}`;
};

/* Sidebar */
const Sidebar = ({ emails: { reduce }, setSidebarSection }) => {
  const unreadCount = reduce(function (previous, msg) {
    if (msg.read !== 'true') {
      return previous + 1;
    }
    return previous;

  }, 0);

  const deletedCount = reduce(function (previous, msg) {
    if (msg.tag === 'deleted') {
      return previous + 1;
    }
    return previous;

  }, 0);

  return (
    <div id="sidebar">
      <div className="sidebar__compose">
        <Button
          id={COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON}
          href="/create-email"
          variant="secondary"
          size="md"
          style={{ marginTop: 10 }}
        >
          Create Email
        </Button>{' '}
      </div>
      <ul className="sidebar__inboxes">
        <li onClick={() => { setSidebarSection('inbox'); }}>
          <a>
            <span className="fa fa-inbox" /> Inbox
            <span className="item-count">{unreadCount}</span>
          </a>
        </li>
        <li onClick={() => { setSidebarSection('sent'); }}>
          <a>
            <span className="fa fa-paper-plane" /> Sent
            <span className="item-count">0</span>
          </a>
        </li>
        <li onClick={() => { setSidebarSection('drafts'); }}>
          <a>
            <span className="fa fa-pencil-square-o" /> Drafts
            <span className="item-count">0</span>
          </a>
        </li>
        <li onClick={() => { setSidebarSection('deleted'); }}>
          <a>
            <span className="fa fa-trash-o" /> Trash
            <span className="item-count">{deletedCount}</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

/* Email classes */
const EmailListItem = ({ email: { from, id, read, subject, time }, onEmailClicked, selected }) => {
  let classes = 'email-item';
  if (selected) {
    classes += ' selected';
  }

  return (
    <div onClick={() => { onEmailClicked(id); }} className={classes}>
      <div className="email-item__unread-dot" data-read={read} />
      <div className="email-item__subject truncate">{subject}</div>
      <div className="email-item__details">
        <span className="email-item__from truncate">{from}</span>
        <span className="email-item__time truncate">{getPrettyDate(time)}</span>
      </div>
    </div>
  );
};

const EmailDetails = ({ email, onDelete }) => {
  if (!email) {
    return (
      <div className="email-content empty" />
    );
  }

  const date = `${getPrettyDate(email.time)} · ${getPrettyTime(email.time)}`;

  const getDeleteButton = () => {
    if (email.tag !== 'deleted') {
      return <span onClick={() => { onDelete(email.id); }} className="delete-btn fa fa-trash-o" />;
    }
    return undefined;
  };

  return (
    <div className="email-content">
      <div className="email-content__header">
        <h3 className="email-content__subject">{email.subject}</h3>
        {getDeleteButton()}
        <div className="email-content__time">{date}</div>
        <div className="email-content__from">{email.from}</div>
      </div>
      <div className="email-content__message">{email.message}</div>
    </div>
  );
};

/* EmailList contains a list of Email components */
const EmailList = ({ emails, onEmailSelected, selectedEmailId }) => {
  if (emails.length === 0) {
    return (
      <div className="email-list empty">
        Nothing to see here, great job!
      </div>
    );
  }

  return (
    <div className="email-list">
      {
        emails.map(email => (
          <EmailListItem
            onEmailClicked={(id) => { onEmailSelected(id); }}
            email={email}
            selected={selectedEmailId === email.id}
          />
        ))
      }
    </div>
  );
};

// Render
$.ajax({ url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/311743/dummy-emails.json',
  type: 'GET',
  success: function (result) {
    ReactDOM.render(<Inbox emails={result} />, document.getElementById('inbox'));
  },
});

Inbox.defaultProps = {
  emails: PropTypes.object.isRequired,
  email: PropTypes.object.isRequired,
};
Inbox.propTypes = {
  emails: PropTypes.shape(),
  email: PropTypes.shape().isRequired,
};
export default Inbox;
