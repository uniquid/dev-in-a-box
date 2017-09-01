/**
 * Checks whether the user is authenticated before rendering child controls
 *
 *
 * @package: Orchestrator
 * @author:  ivan <iminutillo@uniquid.com>
 * @since:   2017-07-03
 */

import { ReactElement } from 'react'

import { connect } from 'react-redux'
import { isLoggedIn } from '@vflows/store/selectors/auth'

export interface Props {
  isLoggedIn: boolean,
  children?: ReactElement<any>,
  unauthenticatedComponent?: ReactElement<any>,
}

const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state),
})

const AuthenticatedOnly = ({ isLoggedIn, children, unauthenticatedComponent }: Props) => (
  isLoggedIn ? children : unauthenticatedComponent
)

export default connect(mapStateToProps)(AuthenticatedOnly)
