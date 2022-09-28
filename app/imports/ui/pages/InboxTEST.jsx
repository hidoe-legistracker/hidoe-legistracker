import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// eslint-disable-next-line prefer-const
let { selectedEmailId, currentSection, emails, setSidebarSection, onEmailClicked, onEmailSelected, selected, onDelete } = this.state;
const { email } = this.props;

// Helper methods
const getPrettyDate = (date) => {
  const store = date.split(' ')[0];
  const newDate = store.split('-');
  const month = months[0];
  return `${month} ${newDate[2]}, ${newDate[0]}`;
};

// Remove the seconds from the time
const getPrettyTime = (date) => {
  const time = date.split(' ')[1].split(':');
  return `${time[0]}:${time[1]}`;
};

/* Inbox */
class InboxTEST extends React.Component {
  constructor(args) {
    super(args);

    // Assign unique IDs to the emails
    // const emails = this.props.emails;
    let id = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const email_emails of emails) {
      email_emails.id = id++;
      selectedEmailId = email_emails.id;
    }
  }

  setSidebarSection(section) {
    /* let selectedEmailId = selectedEmailId;
    if (section !== currentSection) {
      selectedEmailId = '';
    }
     */

    let storeSelectedEmailID = selectedEmailId;
    if (section !== currentSection) {
      storeSelectedEmailID = '';
    }

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      currentSection: section,
      // eslint-disable-next-line react/no-unused-state
      selectedEmailId: storeSelectedEmailID,
    });
  }

  deleteMessage(id) {
    // Mark the message as 'deleted'
    /*
    const emails = this.state.emails;
    const index = emails.findIndex(x => x.id === id);
    emails[index].tag = 'deleted';
     */

    const storeEmails = emails;
    const index = storeEmails.findIndex(x => x.id === id);
    storeEmails[index].tag = 'deleted';

    // Select the next message in the list
    selectedEmailId = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const email_emails of emails) {
      if (email_emails.tag === currentSection) {
        selectedEmailId = email_emails.id;
        break;
      }
    }

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      emails,
      // eslint-disable-next-line react/no-unused-state
      selectedEmailId,
    });
  }

  openEmail(id) {
    /* const emails = this.state.emails;
    const index = emails.findIndex(x => x.id === id);
    emails[index].read = 'true';
    this.setState({
      selectedEmailId: id,
      emails,
    });
     */
    const storeEmails = emails;
    const index = storeEmails.findIndex(x => x.id === id);
    storeEmails[index].read = 'true';
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      selectedEmailId: id,
      // eslint-disable-next-line react/no-unused-state
      emails: storeEmails,
    });
  }

  render() {
    const currentEmail = emails.find(x => x.id === selectedEmailId);
    return (
      <div>
        <Sidebar
          emails={emails}
          setSidebarSection={(section) => { this.setSidebarSection(section); }}
        />
        <div className="inbox-container">
          <EmailList
            emails={emails.filter(x => x.tag === currentSection)}
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

/* Sidebar */
const Sidebar = () => {
  const unreadCount = emails.reduce(function (previous, msg) {
    if (msg.read !== 'true') {
      return previous + 1;
    }
    return previous;

  }, 0);

  const deletedCount = emails.reduce(function (previous, msg) {
    if (msg.tag === 'deleted') {
      return previous + 1;
    }
    return previous;

  }, 0);

  return (
    <div id="sidebar">
      <div className="sidebar__compose">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" className="btn compose">
          Compose <span className="fa fa-pencil" />
        </a>
      </div>
      <ul className="sidebar__inboxes">
        <li>
          <Button onClick={() => { setSidebarSection('inbox'); }}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <span className="fa fa-inbox" /> Inbox
              <span className="item-count">{unreadCount}</span>
            </a>
          </Button>
        </li>
        <li>
          <Button onClick={() => { setSidebarSection('sent'); }}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <span className="fa fa-paper-plane" /> Sent
              <span className="item-count">0</span>
            </a>
          </Button>
        </li>
        <li>
          <Button onClick={() => { setSidebarSection('drafts'); }}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <span className="fa fa-pencil-square-o" /> Drafts
              <span className="item-count">0</span>
            </a>
          </Button>

        </li>
        <li>
          <Button onClick={() => { setSidebarSection('deleted'); }}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <span className="fa fa-trash-o" /> Trash
              <span className="item-count">{deletedCount}</span>
            </a>
          </Button>

        </li>
      </ul>
    </div>
  );
};

/* Email classes */
const EmailListItem = () => {
  let classes = 'email-item';
  if (selected) {
    classes += ' selected';
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div onClick={() => { onEmailClicked(email.id); }} className={classes}>
      <div className="email-item__unread-dot" data-read={email.read} />
      <div className="email-item__subject truncate">{email.subject}</div>
      <div className="email-item__details">
        <span className="email-item__from truncate">{email.from}</span>
        <span className="email-item__time truncate">{getPrettyDate(email.time)}</span>
      </div>
    </div>
  );
};

const EmailDetails = () => {
  if (!email) {
    return (
      <div className="email-content empty" />
    );
  }

  const date = `${getPrettyDate(email.time)} · ${getPrettyTime(email.time)}`;

  const getDeleteButton = () => {
    if (email.tag !== 'deleted') {
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
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
const EmailList = () => {
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
        emails.map(e => (
          <EmailListItem
            onEmailClicked={(id) => { onEmailSelected(id); }}
            email={e}
            selected={selectedEmailId === e.id}
          />
        ))
      }
    </div>
  );
};

// Render
$.ajax({
  url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/311743/dummy-emails.json',
  type: 'GET',
  dataType: 'json',
  success: function (result) {
    ReactDOM.render(<InboxTEST emails={result} />, document.getElementById('inbox'));
  },
});

InboxTEST.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  email: PropTypes.shape().isRequired,
};

export default InboxTEST;
