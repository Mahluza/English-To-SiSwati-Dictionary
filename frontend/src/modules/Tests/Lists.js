import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Skeleton, List } from 'antd';
import 'antd/dist/antd.css';

import { StarOutlined, LikeoutLined, MessageOutlined } from '@ant-design/icons';

// const IconText = ({ type, text }) => (
//   <span>
//     <Icon type={type} style={{ marginRight: 8 }} />
//     {text}
//   </span>
// );

// IconText.propTypes = {
//   type: PropTypes.string,
//   text: PropTypes.string,
// };

const data = [
  {
    title: 'Ant Design Title 1',
    id: 1,
  },
  {
    title: 'Ant Design Title 2',
    id: 2,
  },
];
class Feed extends React.Component {
  render() {
    return (
      <div>
        <List
          itemLayout="vertical"
          size="large"
          //   dataSource={this.props.things}
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={
                !this.props.loading && [
                  <StarOutlined />,
                  //   <IconText key="2" type="like-o" text="156" />,
                  //   <IconText key="3" type="message" text={item.commentsCount} />,
                ]
              }
            >
              <Skeleton loading={this.props.loading} active>
                <List.Item.Meta
                  title={<Link to={`/${item.id}`}>{item.title}</Link>}
                  description={item.headline}
                />
                {/* {item.body} */}
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

Feed.propTypes = {
  things: PropTypes.array,
  loading: PropTypes.bool,
};

export default Feed;
