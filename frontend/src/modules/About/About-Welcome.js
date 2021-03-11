import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Row, Col, Button, Alert } from 'antd';

import './About.css';

const { Title, Text } = Typography;

function AboutWelcome() {
  const history = useHistory();
  return (
    <Row justify="center" className="welcome-main">
      <Col>
        <Row justify="center" className="welcome-name-container" align="middle">
          <Title className="site-name">The SiSwati to English Dictionary</Title>
        </Row>
        <Row className="welcome-text-bound">
          <Text className="welcome-text-style">
            This dictionary is the first of its kind. The SiSwati dialect is the
            native tongue of the people of Eswatini (Swaziland). However, the
            SiSwati dictionary has not been digitized. This project aims to
            rectify this, and in so doing, help preserve the language and
            culture of EmaSwati. This prototype contains approximately 1100
            English words and their Siswati definitions. The reason for this
            modest offering is that the definitions are not all 100% accurate
            yet. This is due to the fact that they are being read from scans and
            have to be verified manually. Many more words will be added as this
            process is completed.
          </Text>
        </Row>
        <Row justify="center" className="feel-free-container">
          {/* <Text className="feel-free-msg">Feel free to delete items in History and Saved Words :)</Text> */}
          <Alert
            message="Feel free to delete items in History and Saved Words :)"
            type="info"
          />
        </Row>
        <Row justify="center" className="enter-container">
          <Button
            type="primary"
            className="enter-button"
            onClick={() => history.push('/home')}
          >
            Enter Site
          </Button>
        </Row>
      </Col>
    </Row>
  );
}

export default AboutWelcome;
