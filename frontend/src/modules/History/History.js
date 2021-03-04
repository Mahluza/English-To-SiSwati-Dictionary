import { React, useState, useEffect } from 'react';
import {
  Row,
  Col,
  Typography,
  List,
  Form,
  Input,
  Button,
  Calendar,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';

import './History.css';
import { useHistory } from 'react-router-dom';

// const instance = axios.create({ baseURL: 'http://localhost:5000' });
const { Title } = Typography;
var data = [];
// require('datejs');
function History() {
  // console.log(Date.today());
  const [history, setHistory] = useState([]);
  const [itemWord, setItemWord] = useState('checking');
  const pageHistory = useHistory();
  // console.log('itemWord', itemWord);
  function onDel(values) {
    console.log('on delete values', values);
    axios.post('/history', { word: values.word }).then((result) => {});
    // pageHistory.push('/history');
    pageHistory.go(0);
    // console.log('event id', event.target.id);
  }
  useEffect(() => {
    axios.get('/history').then((result) => {
      // console.log('get history result:', result);
      var n = result.data.history.length;
      var historyArray = result.data.history;
      var i;
      var date;
      for (i = 0; i < n; i += 2) {
        date = new Date(parseInt(historyArray[i + 1])).toDateString();
        console.log(date);
        let [weekDay, month, day, year] = date.split(' ');
        data.push({
          word: historyArray[i],
          date: { month: month, day: day, year: year },
        });
      }
      // console.log('data', data);

      setHistory(data);
      // var d = parseInt(data[0].date);
      // console.log('original:', data[0].date);
      // console.log('converted:', d);
      // var d1 = new Date(d);
      // console.log('date obj:', d1.toDateString());
    });
  }, []);
  return (
    <div className="history-page">
      <Row justify="center" className="heading-row">
        <Title level={1} className="heading">
          {' '}
          History
        </Title>
      </Row>
      <Row style={{ marginTop: '25px' }}>
        {/* <InfiniteScroll> */}
        <List
          split={false}
          className="history"
          dataSource={history}
          renderItem={(item) => (
            <List.Item
              extra={
                <Form
                  name="wordHistoryName"
                  initialValues={item.word}
                  onFinish={onDel}
                >
                  <Form.Item
                    name="word"
                    initialValue={item.word}
                    hidden={true}
                  />

                  <Form.Item className="align-icon">
                    <Button
                      id={item.word}
                      icon={<DeleteOutlined />}
                      type="text"
                      htmlType="submit"
                    />
                  </Form.Item>
                </Form>
              }
            >
              <List.Item.Meta
                title={item.word}
                description={
                  item.date.month + ' ' + item.date.day + ', ' + item.date.year
                }
              />
            </List.Item>
          )}
        />
        {/* </InfiniteScroll> */}
      </Row>
    </div>
  );
}

export default History;
