import { React, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Radio,
  Alert,
  Select,
} from 'antd';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';

import SaveWordModal from './subcomponents/SaveWordModal';
import './HomePageStyle.css';

const instance = axios.create({
  baseURL: 'http://localhost:' + process.env.PORT,
});

const { Title, Text } = Typography;

const options = [{ value: 'gold' }];

function Home() {
  const [wordInfo, setWordInfo] = useState({});
  const [defVisible, setDefVisible] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [saveHidden, setSaveHidden] = useState(true);
  const [notFoundError, setNotFound] = useState('');
  const [showNotFound, setShowNf] = useState(false);
  // const [modalOptions, setModalOptions] = useState([]);

  //   useEffect(() => {
  //     instance
  //       .get('/definition').then((result) => {
  //       console.log(result);
  //       setWordInfo(result.data);
  //     });
  //   });

  // {
  //   headers: { 'Content-Type': 'application/json' },
  // }

  // save
  // borderless button
  // popup modal
  // checkboxes to add to multiple
  // give option for only one?
  // table
  // list
  // radio buttons
  // success message

  // adding a list item would both have to add the list to the word in the database and trigger a
  // message that says the words has been added

  // to know if added
  // word would have to have a state that gets toggle
  // would require a change in database perhaps
  const onFinish = (values) => {
    console.log('values:', values);
    axios.post('/definition', values).then((result) => {
      console.log('result:', result.data);

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
        // defType will depend on condition in future
        result.data.defType = 'Siswati Definition';
      } else {
        setNotFound(result.data.errMsg);
        setShowNf(true);
        setSaveHidden(true);
      }
      setWordInfo(result.data);
      // console.log('wordInfo:', wordInfo);
      // should you push to home
      // or is useEffect necessary
    });
  };

  const onSave = () => {
    // var listOptions = [];
    // var val = 0;
    // var name;
    // // get lists
    // instance.get('/lists').then((result) => {
    //   console.log(result.data);
    //   for (name of result.data.lists) {
    //     listOptions.push({ label: name, value: val });
    //     val += 1;
    //   }
    //   // console.log(listOptions);
    //   setModalOptions(listOptions);
    //   console.log('modal options:', modalOptions);
    // });

    // other info needed: docID, phoneID, listID, listName, addDate & createDate (can be added automatically)
    // get docID from when word is queried

    // is listId necessary
    // no, if a phoneId exists in a document that's enough
    // phone id hardcoded so already have
    // phoneid doesn't have to be hardcoded coz then how do you change it (To do)
    // opp to use redux
    // find out how to send values in get

    setShowModal(true);
  };

  // destroy modal on cancel
  const onCancel = () => {
    setShowModal(false);
  };

  // function onChange(values) {
  //   console.log('pickedValues:', values);
  // }

  //console.log('showModal:', showModal);
  // To do: radio button plumbing hasn't been implemented
  return (
    <div>
      {alert(process.env.PORT)}
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
        {/* <Col>
          <Button type="primary">English to Siswati</Button>
        </Col>
        <Col>
          <Button type="primary">Siswati to English</Button>
        </Col> */}
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
              // save will ultimated appear only when a word is searched
              // onChange={onChange}
            />
            {/* <Select placeholder="Save" bordered={false} showArrow={false} /> */}
          </Row>
          <Row style={{ paddingLeft: '20px' }}>
            <Title level={3}>{wordInfo.type}</Title>
          </Row>
          <Row style={{ paddingLeft: '40px' }}>
            {/* <Col style={{marginLeft:"-150px"}}>
            <Title level={5}>SiSwati Def:</Title>
            </Col> */}
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
