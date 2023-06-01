import React from 'react';

export function TableHeader(props) {
    return (
        <React.Fragment>
            <tr className='month_header'>
                <MonthHeader {...props} />
            </tr>
            <tr className='day_header'>
                <DayHeader {...props} />
            </tr>
        </React.Fragment>
    );
}

function MonthHeader(props) {
    const days = props.datesInRange;
    let cells = [];
    days.forEach((day, i) => {
        if (day.date() == 1) {
            cells.push(<th key={i} colSpan={day.daysInMonth() - day.date() + 1} style={{ textAlign: "left", borderLeft: "1px solid lightgrey", paddingLeft: "0.5em" }}>{day.format("MMMM")}</th>);
        } else if (i == 0) {
            cells.push(<th key={i} colSpan={day.daysInMonth() - day.date() + 1}>&nbsp;</th>);
        }
    });
    return cells;
}

function DayHeader(props) {
    const days = props.datesInRange
    const day_list = days.map(day => (<th key={day.format('DDD')}>{day.format('dd')}<br />{day.format('D')}</th>));
    return day_list;
}
