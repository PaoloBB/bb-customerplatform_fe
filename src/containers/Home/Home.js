import React, { Component } from 'react';
import { compose } from 'recompose';
// import { Link } from 'react-router-dom';

import config from 'env';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

const hoc = compose(
  connect(state => ({
    online: state.online
  }))
)



class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    // const logoImage = require('./logo.png');
    return (
      <div className={styles.home}>
        <Helmet title="Home" />
        <div className={styles.masthead}>
          <div className="container">
            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>
          </div>
        </div>
      </div>
    );
  }
}
export default hoc(Home);