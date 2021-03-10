import { React, useEffect, useState } from 'react';
import {
  Modal,
  Checkbox,
  Divider,
  Row,
  Col,
  Form,
  Button,
  Input,
  notification,
} from 'antd';
import axios from 'axios';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import './SaveWordModal.css';

function SaveWordModal(props) {
  const [modalOptions, setModalOptions] = useState([]);

  const [selected, setSelected] = useState([]);
  const [disableSave, setDisableSave] = useState([true]);

  useEffect(() => {
    var listOptions = [];
    var val = 0;
    var name;
    // get lists
    axios.get('/api/lists').then((result) => {
      for (name of result.data.lists) {
        listOptions.push({ label: name, value: val });
        val += 1;
      }

      setModalOptions(listOptions);
    });
  }, []);

  // create a new list on frontend
  const onCreateList = (values) => {
    setModalOptions(
      modalOptions.push({ label: values.listName, value: modalOptions.length })
    );
    setModalOptions(modalOptions);
  };

  // save chosen list values
  function onChange(values) {
    if (values.length > 0) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }

    setSelected(values);
  }

  // save word in chosen list(s)
  function onSave() {
    var listNames = [];
    // index of list based on checkbox values
    var listIndex;

    for (listIndex of selected) {
      listNames.push(modalOptions[listIndex].label);
    }

    var values = { mongoId: props.mongoDocId, lists: listNames };
    axios.post('/api/save', values).then((result) => {
      if (result.data.success) {
        notification.open({
          message: 'Saved!',
          icon: <SmileOutlined className="success-icon" />,
        });
      } else {
        notification.open({
          message: 'Save Error!',
          icon: <FrownOutlined className="failure-icon" />,
        });
      }
    });
  }

  return (
    <Modal
      visible={props.visible}
      onCancel={props.handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Checkbox.Group options={modalOptions} onChange={onChange} />
      <Divider />
      <Row>
        <Col span={4}>
          <Button type="primary" onClick={onSave} disabled={disableSave}>
            Save
          </Button>
        </Col>
        <Col span={20}>
          <Form name="createList" onFinish={onCreateList}>
            <Row justify="end">
              <Col className="create-input">
                <Form.Item name="listName">
                  <Input />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Create New List
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
}

export default SaveWordModal;
