/**
 * Returns the provided component as themed component.
 *
 * @package: orchestrator
 * @author:  bernini <iminutillo@uniquid.com>
 * @since:   2017-17-07
 */

import * as React from 'react'

export default (Component, theme, defaultProps = {}) => (props) => (
  <Component {...defaultProps} theme={theme} {...props} />
)
