import { React, useEffect, useState } from 'react';
import { Modal, Checkbox, Divider, Row, Col, Form, Button, Input } from 'antd';
import axios from 'axios';
import { PropertySafetyFilled } from '@ant-design/icons';
import '../HomePageStyle.css';

// // const instance = axios.create({ baseURL: 'http://localhost:5000' });

// const options = [
//   {
//     label: 'Lord of The Rings',
//     value: '2',
//   },
//   {
//     label: 'SAT Words',
//     value: '4',
//   },
// ];

// interface ISaveModalProps{
//   boolean visible;

// }

// function onChange(values) {
//   console.log('pickedValues:', values);
// }

function SaveWordModal(props) {
  const [modalOptions, setModalOptions] = useState([]);
  var selectedOptions = [];

  useEffect(() => {
    var listOptions = [];
    var val = 0;
    var name;
    // get lists
    axios.get('/lists').then((result) => {
      console.log(result.data);
      for (name of result.data.lists) {
        listOptions.push({ label: name, value: val });
        val += 1;
      }
      // console.log(listOptions);
      setModalOptions(listOptions);
      // console.log('modal options:', modalOptions);
    });
  }, []);

  // You can have state here that gets updated by the props in parent
  // but can also update itself

  // console.log('SaveWordModal visible', visible);

  const onCreateList = (values) => {
    // var list
    // var newListOptions;
    // // modalOptions.push({
    // //   label: values.listName,
    // //   value: modalOptions.length,
    // // });
    // // newList = modalOptions;
    // for (list of modalOptions){
    //   newListOptions.push(list)
    // }

    setModalOptions(
      modalOptions.push({ label: values.listName, value: modalOptions.length })
    );
    setModalOptions(modalOptions);
  };

  function onChange(values) {
    selectedOptions = values;
    // console.log('selected:', selectedOptions);
    // console.log('pickedValues:', values);
  }

  // to keep saved
  // will gave to retrieve lists a word is saved to each time it's queried and set those as default selections
  function onSave() {
    // console.log('docID:', props.mongoDocId);
    var listNames = [];
    // index of list based on checkbox values
    var listIndex;
    for (listIndex of selectedOptions) {
      listNames.push(modalOptions[listIndex].label);
    }
    // console.log('listNames:', listNames);
    var values = { mongoId: props.mongoDocId, lists: listNames };
    axios.post('/save', values);
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
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </Col>
        <Col span={20}>
          <Form name="createList" onFinish={onCreateList}>
            <Row justify="end">
              <Col style={{ marginRight: '5px' }}>
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
