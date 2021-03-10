import { React, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { List, Row, Col, Typography, Menu, Dropdown } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';

import './SavedWords.css';
// TODO: refines scroll of LISTs. Appears to currently scroll if two too many.
const { Title } = Typography;

const words = [];

function SavedWords() {
  const [data, setData] = useState([]);
  const [wordData, setWordData] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [listRender, setListRender] = useState(false);

  const listNames = [];

  const history = useHistory();
  var location = useLocation();
  var locationArray = location.pathname.split('/');

  useEffect(() => {
    axios.get('/api/lists').then((result) => {
      var name;
      // extract names of retrieved user lists
      for (name of result.data.lists) {
        listNames.push({ title: name });
      }

      setData(listNames);
    });

    // if a list has been selected
    // retrieve its members
    // memebrs route is same as saved/ + phoneId/ + listName
    if (locationArray.length > 2) {
      var listName = locationArray[3];
      setSelectedList(listName);
      setListRender(true);
      var values = { phoneId: 2, listName: listName };
      axios.post('/api/getwords', values).then((result) => {
        var doc;
        for (doc of result.data.words) {
          words.push({ id: doc._id, spelling: doc.word });
        }

        setWordData(words);
      });
    }
  }, []);

  // deletes a list
  function onListDel(menuVal) {
    var values = { phoneID: 2, listName: menuVal.key };
    axios.post('/api/listdel', values).then((result) => {});
    // TODO: try delete the relevant list from the state and have the site update that way

    history.push('/saved');
    history.go(0);
  }

  // deletes a word
  function onWordDel(menuVal) {
    var wordMongoId = menuVal.key;
    var values = { docID: wordMongoId, phoneID: 2, listName: locationArray[3] };
    axios.post('/api/deleteword', values).then((result) => {});

    const wordToDel = (object) => object.id === wordMongoId;
    var i = wordData.findIndex(wordToDel);
    wordData.splice(i, 1);
    history.go(0);
  }

  return (
    <div className="page-container saved-page">
      <Row className="col-container">
        <Col span={5} className="list-column">
          <InfiniteScroll>
            <Row className="lists-container">
              <Title level={4} className="lists-title">
                LISTS
              </Title>
            </Row>
            <Row className="list-padding">
              <List
                className="list-words lists"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item
                    className="list-items"
                    extra={
                      <Dropdown.Button
                        className="more-button"
                        overlay={
                          <Menu onClick={onListDel}>
                            <Menu.Item key={item.title}>Delete</Menu.Item>
                          </Menu>
                        }
                        trigger={['click']}
                        type="link"
                      />
                    }
                  >
                    <List.Item.Meta
                      title={
                        <a
                          href={'/saved/' + '2/' + item.title}
                          className="list-items-color"
                        >
                          {item.title}
                        </a>
                      }
                    />
                  </List.Item>
                )}
              />
            </Row>
          </InfiniteScroll>
        </Col>

        <Col span={19}>
          <InfiniteScroll>
            {listRender ? (
              <div>
                <Row className="list-members">
                  <Col span={8}></Col>
                  <Col span={8}>
                    <Row justify="center">
                      <Title level={2}>{selectedList}</Title>
                    </Row>
                  </Col>
                  <Col span={8}></Col>
                </Row>
                <Row>
                  <List
                    split={false}
                    className="words"
                    dataSource={wordData}
                    renderItem={(item) => (
                      <List.Item
                        extra={
                          <Dropdown.Button
                            overlay={
                              <Menu onClick={onWordDel}>
                                <Menu.Item key={item.id}>Delete</Menu.Item>
                              </Menu>
                            }
                            trigger={['click']}
                            type="text"
                          />
                        }
                      >
                        <List.Item.Meta title={item.spelling} />
                      </List.Item>
                    )}
                  />
                </Row>
              </div>
            ) : (
              <Row></Row>
            )}
          </InfiniteScroll>
        </Col>
      </Row>
    </div>
  );
}

export default SavedWords;
