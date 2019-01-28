import React from 'react';
import PropTypes from 'prop-types';
import GlobalStore from '../GlobalStore';

export const PageLayout = ({ children }) => (
  <GlobalStore>
    {children}
  </GlobalStore>
)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout
