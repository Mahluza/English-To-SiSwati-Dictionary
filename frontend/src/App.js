import { React } from 'react';
import { Switch, Route, Redirect, useLocation, Link } from 'react-router-dom';
import { Menu, Layout, Typography } from 'antd';

import './App.css';
import 'antd/dist/antd.css';

import AboutWelcome from './modules/About/About-Welcome';
import About from './modules/About/About';
import Home from './modules/HomePage/Home';
import SavedWords from './modules/SavedWordsPage/SavedWords';
import History from './modules/History/History';

const { Header, Footer } = Layout;
const { Text } = Typography;

function App() {
  let location = useLocation();

  const onMenuClick = (e) => {};

  return (
    <Layout className="main-component-layout">
      {location.pathname !== '/about-welcome' && (
        <Header class="header-cross-site">
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
            onClick={onMenuClick}
            selectedKeys={[location.pathname.split('/')[1]]}
          >
            <Menu.Item key="home">
              <Link to="/home">SISWATI TO ENGLISH DICTIONARY</Link>
            </Menu.Item>
            <Menu.Item key="saved">
              <Link to="/saved">Saved Words</Link>
            </Menu.Item>
            <Menu.Item key="about">
              <Link to="/about">About</Link>
            </Menu.Item>
            <Menu.Item key="history" style={{ float: 'right' }}>
              <Link to="/history">History</Link>
            </Menu.Item>
          </Menu>
        </Header>
      )}

      <Switch>
        <Route exact path="/">
          <Redirect to="/about-welcome" />
        </Route>
        <Route path="/about-welcome" component={AboutWelcome} />
        <Route path="/about" component={About} />
        <Route path="/home" component={Home} />;
        <Route path="/saved" component={SavedWords} />;
        <Route path="/saved/:phoneid/:list" component={SavedWords} />;
        <Route path="/history" component={History} />;
      </Switch>

      {location.pathname !== '/about-welcome' && (
        <Footer className="footer">
          <Text className="menu-text-color">
            ©2021 Created by Ndabe Mahluza
          </Text>
        </Footer>
      )}
    </Layout>
  );
}

export default App;
