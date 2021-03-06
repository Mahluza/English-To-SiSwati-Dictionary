import { React, useState } from 'react';
import { Row, Col, Typography, Form, Input, Button, Radio, Alert } from 'antd';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';

import SaveWordModal from './subcomponents/SaveWordModal';
import './HomePageStyle.css';

const { Title, Text } = Typography;

function Home() {
  const [wordInfo, setWordInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [saveHidden, setSaveHidden] = useState(true);
  const [notFoundError, setNotFound] = useState('');
  const [showNotFound, setShowNf] = useState(false);

  const onFinish = (values) => {
    axios.post('/api/definition', values).then((result) => {
      switch (result.data.type) {
        case 'n':
          result.data.type = 'noun';
          break;
        case 'conj':
          result.data.type = 'conjunction';
          break;
        case 'adv':
          result.data.type = 'adjective';
          break;
        case 'interj':
          result.data.type = 'interjection';
          break;
        case 'qual':
          result.data.type = 'qualificative';
          break;
        case 'v':
          result.data.type = 'verb';
          break;
        case 'pron':
          result.data.type = 'pronoun';
          break;
        default:
          break;
      }

      // if error msg present, don't set to false and make visible
      if (!('errMsg' in result.data)) {
        setSaveHidden(false);
        setShowNf(false);
        // TODO: distinguish between SiSwati and English definition as database expands
        result.data.defType = 'Siswati Definition';
      } else {
        setNotFound(result.data.errMsg);
        setShowNf(true);
        setSaveHidden(true);
      }
      setWordInfo(result.data);
    });
  };

  const onSave = () => {
    setShowModal(true);
  };

  // destroy modal on cancel
  const onCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Row justify="center" align="middle" style={{ height: '50px' }}>
        {showNotFound ? (
          <Alert
            style={{ height: '26px' }}
            message={notFoundError}
            type="error"
          ></Alert>
        ) : (
          <div></div>
        )}
      </Row>
      <Row justify="center">
        <Title level={2}>Search for a Word</Title>
      </Row>
      <Row justify="center">
        <Radio.Group defaultValue="english">
          <Radio.Button value="english">English to Siswati</Radio.Button>
          <Radio.Button value="siswati" disabled>
            Siswati to English
          </Radio.Button>
        </Radio.Group>
      </Row>
      <Row justify="center" style={{ marginTop: '10px' }}>
        <Form name="wordToSearch" onFinish={onFinish}>
          <Row>
            <Col>
              <Form.Item name="word">
                <Input className="input-dimensions" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button
                  htmlType="submit"
                  icon={<SearchOutlined style={{ fontSize: '25px' }} />}
                  style={{ height: '50px', width: '50px' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Row>
      <Row>
        <Col span={2}></Col>
        <Col span={12}>
          <Row>
            <Title level={1} style={{ marginBottom: '10px' }}>
              {wordInfo.word}
            </Title>
          </Row>
          <Row>
            <Button
              type="link"
              style={{
                fontSize: '18px',
                paddingLeft: '20px',
                marginBottom: '10px',
                border: '0px',
              }}
              onClick={onSave}
              hidden={saveHidden}
            >
              Save
            </Button>
            <SaveWordModal
              visible={showModal}
              handleCancel={onCancel}
              mongoDocId={wordInfo.docID}
            />
          </Row>
          <Row style={{ paddingLeft: '20px' }}>
            <Title level={3}>{wordInfo.type}</Title>
          </Row>
          <Row style={{ paddingLeft: '40px' }}>
            <Title level={5}>{wordInfo.defType}</Title>
          </Row>
          <Row style={{ paddingLeft: '60px' }}>
            <Text style={{ fontSize: '16px' }}>{wordInfo.def}</Text>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
