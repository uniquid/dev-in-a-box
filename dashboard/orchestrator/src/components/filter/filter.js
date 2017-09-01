import React, {Component} from 'react'

import NameFilter from './name'
import SelectFilter from './select'
import TagFilter from './tag'

export class Filter extends Component {

  componentWillUnmount (){
    if(this.props.dump){
      this.props.dump(this.state)
    }
  }
  componentWillMount (){
    this.setFilter = prop_name => event => {
      const value = event.target.value
      const new_state = {
        matches: {
          ...this.state.matches,
          [prop_name]: event.target.value
        }
      }
      this.filterData(new_state.matches)
      this.setState(new_state)
    }
    this.filterData = (matches) => {
      // console.log(this)
      let filter_data = Object.keys(matches).reduce((accum, prop_name) => {
        const match = matches[prop_name]
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

  componentDidUpdate (prevProps) {
    if (prevProps.data !== this.props.data) {
      this.filterData(this.state.matches)
    }
  }

  render () {
    return (
      <div className='list_filter row collapse'>
        {this.props.filters.map((filter, i) => (
          <div key={i} className={'medium-' + 12/this.props.filters.length + ' columns'}>
           {filter === 'name' ? <NameFilter title={filter} filterName={this.setFilter(filter)} value={this.state.matches[filter]} /> : ''}
           {filter === 'user' ? <NameFilter title={filter} filterName={this.setFilter(filter)} value={this.state.matches[filter]} /> : ''}
           {filter === 'status' ? <SelectFilter title={filter}
                                                options={this.props.statusNames || ['created','imprinting', 'imprinted', 'orchestrating', 'orchestrated']}
                                                filterStatus={this.setFilter(filter)}
                                                value={this.state.matches[filter]} /> : ''}
           {filter === 'tag' ? <TagFilter /> : ''}
          </div>
        ))}
      </div>
    )
  }
}

const prop_str_equals_ignore_case = prop_name => match => obj => !!obj && String(match).toLowerCase() === String(obj[prop_name]).toLowerCase()
const prop_str_like = prop_name => match => obj => !!obj && str_like(match)(obj[prop_name])
const str_like = match => string => new RegExp(match, 'gi').test(string)
const _no_filter = Symbol()
const filterRows = comparator => data => match => match === _no_filter ? data.slice() : data.filter(comparator(match))

export default Filter
