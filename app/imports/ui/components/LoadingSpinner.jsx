import React from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ message }) => (
  <Container style={{ marginTop: '30vh' }}>
    <Row className="justify-content-md-center">
      <Spinner animation="border" style={{ marginRight: '1em' }} />
      <h3>{message}</h3>
    </Row>
  </Container>
);

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

LoadingSpinner.defaultProps = {
  message: 'Getting Data',
};

export default LoadingSpinner;
