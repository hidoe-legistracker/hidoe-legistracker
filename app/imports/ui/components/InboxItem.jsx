import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
// import { PAGE_IDS } from '../utilities/PageIDs';

// used https://www.npmjs.com/package/react-to-print
const InboxItem = ({ item }) => (
  <Row style={{ backgroundColor: 'whitesmoke' }}>
    <Col xs={1}>

    </Col>
    <Col>

    </Col>
  </Row>
);

// Require a document to be passed to this component.
InboxItem.propTypes = {
  item: PropTypes.shape({
    from: PropTypes.string,
    subject: PropTypes.string,
    time: PropTypes.string,
  }).isRequired,
};

export default InboxItem;