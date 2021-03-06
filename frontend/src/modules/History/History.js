import { React, useState, useEffect } from 'react';
import { Row, Typography, List, Form, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './History.css';

const { Title } = Typography;

function History() {
  var data = [];
  const [history, setHistory] = useState([]);
  const pageHistory = useHistory();
  function onDel(values) {
    axios.post('/api/history', { word: values.word }).then((result) => {});
    pageHistory.go(0);
  }
  useEffect(() => {
    axios.get('/api/history').then((result) => {
      //
      var n = result.data.history.length;
      var historyArray = result.data.history;
      var i;
      var date;
      for (i = 0; i < n; i += 2) {
        date = new Date(parseInt(historyArray[i + 1])).toDateString();

        let [weekDay, month, day, year] = date.split(' ');
        data.push({
          word: historyArray[i],
          date: { month: month, day: day, year: year },
        });
      }

      setHistory(data);
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
        {/* TODO: Implement infinite scroll */}
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
      </Row>
    </div>
  );
}

export default History;
