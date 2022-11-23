import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '10px', paddingBottom: '10px', height: '70px' };
  const doeLogo = { float: 'left', position: 'absolute', width: '50px' };
  return (
    <footer className="mt-auto bg-light">
      <Container style={divStyle}>
        <img style={doeLogo} src="https://www.pbshawaii.org/wp-content/uploads/2016/03/hawaii-doe.png" alt="Hawaii DOE Logo" />
        <Row>
          <Col className="text-center">Hawaii State Department of Education</Col>
        </Row>
        <Row>
          <Col className="text-center">Ka ʻOihana Hoʻonaʻauao o ke Aupuni Hawaiʻi</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
