import React from 'react';
import { Typography, Row, Col } from 'antd';

import './About.css';

const { Title, Text } = Typography;

function About() {
  return (
    <div className="about-main">
      <Row justify="center" className="heading-row">
        <Title level={1} className="heading">
          About
        </Title>
      </Row>
      <Row justify="center" className="about-content">
        <Col>
          <Row className="about-text-bound">
            <Text className="about-text-style">
              This dictionary is the first of its kind. The SiSwati dialect is
              the native tongue of the people of Eswatini (Swaziland). However,
              the SiSwati dictionary has not been digitized. This project aims
              to rectify this, and in so doing, help preserve the language and
              culture of EmaSwati. This prototype contains approximately 1100
              English words and their Siswati definitions. The reason for this
              modest offering is that the definitions are not all 100% accurate
              yet. This is due to the fact that they are being read from scans
              and have to be verified manually. Many more words will be added as
              this process is completed.
            </Text>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default About;
