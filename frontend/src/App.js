import { React, useState } from 'react';
import {
  Switch,
  Route,
  BrowserRouter,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { Menu, Layout, Typography } from 'antd';

import './App.css';
import 'antd/dist/antd.css';

import Home from './modules/HomePage/Home';
import SavedWords from './modules/SavedWordsPage/SavedWords';
import History from './modules/History/History';
import AddWordModal from './modules/HomePage/subcomponents/SaveWordModal';
import Feed from './modules/Tests/Lists';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
// the question is what format is the form information being sent in from react
// it will be sent in a get from here
// to a get in the backend
// then the res will have the definition
// first step is to send the request from here
function App() {
  let location = useLocation();
  console.log('location:', location);
  // let history = useHistory()
  console.log('location:', location.pathname.split('/'));

  const onMenuClick = (e) => {
    // console.log('key', e.key);
  };

  return (
    <Layout className="main-component-layout">
      <Header class="header-cross-site">
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px' }}
          onClick={onMenuClick}
          selectedKeys={[location.pathname.split('/')[1]]}
        >
          <Menu.Item key="home">
            <a href="http://localhost:3000/home">
              SISWATI TO ENGLISH DICTIONARY
            </a>
          </Menu.Item>
          <Menu.Item key="saved">
            <a href="http://localhost:3000/saved">Saved Words</a>
          </Menu.Item>
          <Menu.Item key="history" style={{ float: 'right' }}>
            <a href="http://localhost:3000/history">History</a>
          </Menu.Item>
        </Menu>
      </Header>
      {/* <BrowserRouter> */}
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="/home" component={Home} />;
        <Route path="/saved" component={SavedWords} />;
        <Route path="/saved/:list" component={SavedWords} />;
        <Route path="/history" component={History} />;
        {/* <Route path="/modaltest" component={AddWordModal} />;
          <Route path="/test" component={Feed} /> */}
      </Switch>
      {/* </BrowserRouter> */}

      <Footer className="footer">
        <Text className="menu-text-color">©2021 Created by Ndabe Mahluza</Text>
      </Footer>
    </Layout>
  );
}

export default App;
