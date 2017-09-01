import React from 'react'
import moment from 'moment'

const Row = (props) => {
    return (
    <div className='table_row'>
        <div className='table_row-container'>
        <div className='table_row-single flex-row'>
            <div className='row_item flex-item select'>
            <div className='item_container'>
            <div className={'checkbox clearfix ' + props.status}>
                <input checked={props.checked} type='checkbox' id={props.xpub} onChange={() => {props.selectNodes(props.info)}} />
                <label htmlFor={props.xpub}></label>
            </div>
            </div>
        </div>
            <div className='row_item flex-item name'>
            <div className='item_container'>
                {props.name}
            </div>
            </div>
            <div className='row_item flex-item balance'>
            <div className='item_container'>
                <span>undefined</span>
            </div>
            </div>
            <div className='row_item flex-item born'>
            <div className='item_container'>{moment(props.timestamp).format('D MMM, YYYY')}</div>
            </div>
            <div className='row_item flex-item icon'>
            <div className='item_container'>
                <div className='icon_container'>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}

export default Row
