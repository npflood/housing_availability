import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useState } from 'react';
import { initializeBlock, useBase, Box} from '@airtable/blocks/ui';
import { DateSelector } from './DateSelector';
import { HouseList } from './House';
import { TableHeader } from './TableHeader';
import './app.css';


export const table_style = {border: "1px solid", borderCollapse: "collapse"};

function HousingAvailabilityApp() {
    const base = useBase();
    const [startDate, setStartDate] = useState(Date.now())

    const date_range = () => {
        const moment = extendMoment(Moment);
        const beginning_of_month = moment(startDate).startOf('month').clone();
        const beginning_of_range = beginning_of_month.startOf('week').clone(); //the beginning of the week containing the beginning of the month
        const end_of_month = moment(startDate).endOf('month').clone();
        const end_of_range = end_of_month.endOf('week').clone(); //the end of the week containing the end of the month
        return moment.range(beginning_of_range, end_of_range).clone();
    }

    const dates_in_range = () => {
        const range = date_range();
        const days = Array.from(range.by('day'));
        return days;
    }

    return( <Box>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={3} rowSpan={3}>
                                <DateSelector startDate={startDate} onChangeDate={setStartDate} />
                            </th>
                        </tr>
                        <TableHeader datesInRange={dates_in_range()}/>
                    </thead>
                    <HouseList base={base} dateRange={date_range()} />
                </table>
            </Box>)
}

initializeBlock(() => <HousingAvailabilityApp />);
