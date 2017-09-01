import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Folder from '../../modules/sidebar.modules/folder'
import SidebarMenu from '../../modules/sidebar.modules/sidebar.menu'


class Sidebar extends Component {
  constructor () {
    super()
    this.handleUserInput = this.handleUserInput.bind(this)
    this.toggle = this.toggle.bind(this)
    this.state = {
      filterText: '',
      visible: false
    }
  }

  toggle () {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleUserInput (event) {
    this.setState({
      filterText: event.target.value
    })
  }

  render () {
    return (
      <aside id='sidebar_management' className={this.props.palette}>
        <SidebarMenu
          logo={this.props.logo}
          name={this.props.name}
        />
        <Folder
          title={'Contexts'}
          icon={'icon-folder2'}
          contexts={this.props.contexts}
          toggle={this.toggle}
          visible={this.state.visible}
          handleUserInput={this.handleUserInput}
          filterText={this.state.filterText}
        />
      </aside>
    )
  }
}

Sidebar.propTypes = {
  name: PropTypes.string,
  logo: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string,
  contexts: PropTypes.array,
  toggle: PropTypes.func,
  visible: PropTypes.bool,
  handleUserInput: PropTypes.func,
  filterText: PropTypes.string
}

Sidebar.defaultProps = {
  name: 'Orchestrator',
  logo: 'uniquid_white',
  title: 'Contexts',
  icon: 'icon-folder2',
  visible: false,
  filterText: ''
}

export default Sidebar
