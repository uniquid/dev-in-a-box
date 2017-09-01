import React from 'react'
import PropTypes from 'prop-types'

class SearchBar extends React.Component {
  componentWillUnmount () {
    if (this.props.dump) {
      this.props.dump(this.state)
    }
  }
  componentWillMount () {
    this.setFilter = prop_name => event => {
      const value = event.target.value
      if (value) {
        this.setState({
          matches: {
            ...this.state.matches,
            name: event.target.value
          }
        })
        // this.state.matches[prop_name] = event.target.value
      } else{
        delete this.state.matches[prop_name]
      }
      this.filterData()
    }
    this.filterData = () => {
      // console.log(this)
      let filter_data = Object.keys(this.state.matches).reduce((accum, prop_name) => {
        const match = this.state.matches[prop_name]
        const comparator = prop_name === 'status' ? prop_str_equals_ignore_case(prop_name) : prop_str_like(prop_name)
        return filterRows(comparator)(accum)(match || _no_filter)
      }, this.props.data.slice())
      this.props.filtered(filter_data)
    }
    this.setState({
      matches: Object.assign({}, this.props.matches)
    })
    // this.filterData()
  }

  // componentDidUpdate (prevProps) {
  //   if (prevProps.data !== this.props.data) {
  //     this.filterData()
  //   }
  // }

  render () {
    return (
      <div className='form_container'>
        {this.props.type === 'user' ? (
            <div className={'checkbox clearfix'}>
              <input checked={'false'} type='checkbox' id={1} onChange={() => { this.props.totalSelector(!this.props.toggledControlled, this.props.nodes) }} />
              <label htmlFor={1} />
            </div>
          ) : '' }
        <input className='selection_search' placeholder={this.props.placeholder} onChange={this.setFilter('name')} value={this.state.matches.name} />
        <span className='icon-magnifying-glass' />
      </div>
      )
  }
}


const prop_str_equals_ignore_case = prop_name => match => obj => !!obj && String(match).toLowerCase() === String(obj[prop_name]).toLowerCase()
const prop_str_like = prop_name => match => obj => !!obj && str_like(match)(obj[prop_name])
const str_like = match => string => new RegExp(match, 'gi').test(string)
const _no_filter = Symbol()
const filterRows = comparator => data => match => match === _no_filter ? data.slice() : data.filter(comparator(match))

SearchBar.propTypes = {
  handleChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string
}

export default SearchBar
