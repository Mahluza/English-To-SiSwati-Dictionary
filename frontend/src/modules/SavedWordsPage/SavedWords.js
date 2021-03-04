import { React, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  List,
  Row,
  Col,
  Typography,
  Button,
  Select,
  Menu,
  Dropdown,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';

import './SavedWords.css';

// const instance = axios.create({ baseURL: 'http://localhost:5000' });
const { Title } = Typography;
const { Option } = Select;

// const data = [
//   {
//     title: 'Ant Design Title 1',
//   },
//   {
//     title: 'Ant Design Title 2',
//   },
// ];
const listNames = [];
const words = [];

function SavedWords() {
  const [data, setData] = useState([]);
  const [wordData, setWordData] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [listRender, setListRender] = useState(false);
  // const menu = (
  //   <Menu onClick={onListDel}>
  //     <Menu.Item key={0}>Delete</Menu.Item>
  //   </Menu>
  // );
  //
  const history = useHistory();
  var location = useLocation();
  var locationArray = location.pathname.split('/');
  console.log('url:', location.pathname);

  useEffect(() => {
    axios.get('/lists').then((result) => {
      //console.log('result1:', result.data.lists);
      var name;
      for (name of result.data.lists) {
        listNames.push({ title: name });
      }

      setData(listNames);
      // console.log('data:', data);
      // itereate
      // create object with title in it
      // put
    });

    console.log('url size:', locationArray.length);
    // if a list has been selected
    if (locationArray.length > 2) {
      var listName = locationArray[3];
      setSelectedList(listName);
      setListRender(true);
      var values = { phoneId: 2, listName: listName };
      axios.post('/getwords', values).then((result) => {
        console.log('result2:', result.data.words);
        var doc;
        for (doc of result.data.words) {
          words.push({ id: doc._id, spelling: doc.word });
        }

        setWordData(words);
        console.log('data2:', wordData);
        // itereate
        // create object with title in it
        // put
      });
    }
  }, []);

  function onListDel(menuVal) {
    console.log(menuVal);

    var values = { phoneID: 2, listName: menuVal.key };
    axios.post('/listdel', values).then((result) => {
      console.log(result.data.msg);
    });
    // I could delete the relevant list from the state and have the site update that way
    // probably more efficient

    // thought this was taking care of the state update
    history.push('/saved');
    history.go(0);

    // just reroute. no need to change state.
    //setData([]);
  }

  function onWordDel(menuVal) {
    //send doc id when words are put in list
    //need listName as well - get from location
    // setWordData([{ spelling: 'only i survived' }]);
    var wordMongoId = menuVal.key;
    var values = { docID: wordMongoId, phoneID: 2, listName: locationArray[3] };
    axios.post('/deleteword', values).then((result) => {
      console.log(result.data.msg);
    });

    const wordToDel = (object) => object.id === wordMongoId;
    var i = wordData.findIndex(wordToDel);
    wordData.splice(i, 1);
    history.go(0);
    // console.log('word data before set', wordData);
    // setWordData(wordData);
    // console.log('word data after', wordData);
  }

  return (
    <div style={{ height: '100%', width: '100%' }} className="saved-page">
      <Row style={{ height: '100%' }}>
        <Col span={5} className="list-column">
          <InfiniteScroll>
            <Row style={{ paddingLeft: '20px', marginTop: '20px' }}>
              {/* <Title level={5} style={{ color: '#001529', fontSize: '14px' }}> */}
              <Title level={4} style={{ color: '#001529' }}>
                LISTS
              </Title>
            </Row>
            <Row className="list-padding">
              <List
                className="list-words lists"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item
                    style={{ border: '0px' }}
                    extra={
                      // <Button size="small" onClick={onListDel}>
                      //   ...
                      // </Button>
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
                      // To Do: phoneId ('2') will not be hardcoded in final product
                      title={
                        <a
                          href={'/saved/' + '2/' + item.title}
                          style={{ color: '#001529' }}
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
                <Row style={{ marginTop: '65px' }}>
                  <Col span={8}></Col>
                  <Col span={8}>
                    <Row justify="center">
                      <Title level={2}>{selectedList}</Title>
                    </Row>
                  </Col>
                  <Col span={8}></Col>
                  {/* <Title level={3} style={{ paddingLeft: '200px' }}>
                    {selectedList}
                  </Title> */}
                </Row>
                <Row>
                  <List
                    split={false}
                    className="words"
                    dataSource={wordData}
                    renderItem={(item) => (
                      <List.Item
                        extra={
                          // <Button size="small" onClick={onListDel}>
                          //   ...
                          // </Button>
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
