import { Heading, Box, Button, TextButton } from '@airtable/blocks/ui';
import Moment from 'moment';
import React from 'react';
import './DateSelector.css';


export function DateSelector(props) {
    Moment.locale('en');
    
    const current_date = Moment(props.startDate)

    function changeDate(momentInstance){
        props.onChangeDate(momentInstance.toDate())
    }

    function incrementDate(period) {
        changeDate(current_date.add(1, period))
    }
    function decrementDate(period) {
        changeDate(current_date.add(-1, period))
    }
    function setThisMonth() {
       changeDate(Moment(Date.now()))
    }

    const startMonthString = current_date.format('MMM YYYY');
    return (
        <div id='date_selector'>
            <Button id='today' variant='primary' size="large" onClick={() => setThisMonth()}>Today</Button>
            {/* <TextButton variant="light" size="xlarge" onClick={() => decrementDate("Y")}>&lt;&lt;</TextButton> */}
            <div className='button_group'>
                <TextButton variant="light" size="xlarge" icon="chevronLeft" onClick={() => decrementDate("M")} aria-label='Previoius Month'/>
                <TextButton variant="light" size="xlarge" icon="chevronRight" onClick={() => incrementDate("M")} aria-label='Next Month' />
            </div>
            <Heading>{startMonthString}</Heading>
            {/* <TextButton variant="light" size="xlarge" onClick={() => incrementDate("Y")}>&gt;&gt;</TextButton> */}
        </div>);
}
