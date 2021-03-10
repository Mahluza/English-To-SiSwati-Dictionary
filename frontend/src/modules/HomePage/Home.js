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
      // replaces abbreviation with full version of word's type
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

      // if word is found/errMsg not present
      // show save button
      // don't show not found notification
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
      <Row justify="center" align="middle" className="alert-container">
        {showNotFound ? (
          <Alert className="alert" message={notFoundError} type="error"></Alert>
        ) : (
          <div></div>
        )}
      </Row>
      <Row justify="center">
        <Title level={2}>Search for a Word Between F-M</Title>
      </Row>
      <Row justify="center">
        <Radio.Group defaultValue="english">
          <Radio.Button value="english">English to Siswati</Radio.Button>
          <Radio.Button value="siswati" disabled>
            Siswati to English
          </Radio.Button>
        </Radio.Group>
      </Row>
      <Row justify="center" className="input-container">
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
                  icon={<SearchOutlined className="search-icon" />}
                  className="search-button"
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
            <Title level={1}>{wordInfo.word}</Title>
          </Row>
          <Row>
            <Button
              type="link"
              className="save-button"
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
          <Row className="word-type">
            <Title level={3}>{wordInfo.type}</Title>
          </Row>
          <Row className="word-def-type">
            <Title level={5}>{wordInfo.defType}</Title>
          </Row>
          <Row className="word-def-container">
            <Text className="word-def">{wordInfo.def}</Text>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
