import React from 'react';

export default () => {
  const styles = require('./InfoBar.scss');
  return (
    <div className={`${styles.infoBar} well`}>
      <div className="container">here we can put some info</div>
    </div>
  );
};
