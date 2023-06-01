import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { useRecords } from '@airtable/blocks/ui';
import React from 'react';

export function Room(props) {
    const moment = extendMoment(Moment);
    const room = props.room;
    const capacity = room.getCellValue("Capacity");
    const dateRange = props.dateRange;
    const reservations = useRecords(room.selectLinkedRecordsFromCell('Reservations'));
    const reservations_in_view = reservations.filter(reservation_is_in_view);
    // let conflicts = new Set();

    // reservations_in_view.forEach((reservation_a) => {
    //     reservations_in_view.forEach((reservation_b) =>{
    //         if(reservation_a != reservation_b){
    //             let reservation_a_date_range = reservation_date_range(reservation_a)
    //             let reservation_b_date_range = reservation_date_range(reservation_b)
    //             if(reservation_a_date_range.overlaps(reservation_b_date_range)){
    //                 conflicts.add([reservation_a, reservation_b])
    //                 conflicts.add([reservation_b, reservation_a])
    //             }
    //         }
    //     })
    // });

    function get_conflicts(reservation) {
        let conflicts = new Set();
        reservations_in_view.forEach((reservation_b) =>{
            if(reservation != reservation_b){
                let reservation_a_date_range = reservation_date_range(reservation)
                let reservation_b_date_range = reservation_date_range(reservation_b)
                if(reservation_a_date_range.overlaps(reservation_b_date_range)){
                    conflicts.add(reservation_b)
                }
            }
        })
        return Array.from(conflicts)
    }


    function reservation_date_range(reservation) {
        const start_date = reservation.getCellValue("Check In Date");
        const end_date = reservation.getCellValue("Check Out Date");
        return moment.range(start_date, end_date);
    }

    function reservation_is_in_view(reservation) {
        return reservation_date_range(reservation).overlaps(dateRange);
    }

    function reservation_intersect_range(reservation) {
        return reservation_date_range(reservation).intersect(dateRange);
    }

    function reservation_days_in_view(reservation) {
        return Array.from(reservation_intersect_range(reservation).by('day'));
    }

    function reservation_is_on_day(reservation, day) {
        return reservation_date_range(reservation).contains(day);
    }

    function reservation_starts_on_day(reservation, day) {
        const start_date = reservation.getCellValue("Check In Date");
        return day.isSame(start_date, 'day');
    }


    const cells = Array.from(dateRange.by('day')).map((date, index) => {
        const reservations_on_day = reservations_in_view.filter(function (reservation) { return reservation_is_on_day(reservation, date); });

        if (reservations_on_day.length < 1) {
            return <td key={index} className='unreserved'></td>;
        }

        const reservation = reservations_on_day[0];
        const conflicts = get_conflicts(reservation);
        const first_day_of_reservation = reservation_starts_on_day(reservation, date);

        if (index > 0 && !first_day_of_reservation) {
            return null;
        }
        // if(conflicts.length != 0){
        //     // create 

        //     return <ReservationBlock key={index} days={reservation_days_in_view(reservation).length} text={"Conflict"} status={"error"} />
        // }

        const status_class = reservation.getCellValue("Status").name;
        return <ReservationBlock key={index} days={reservation_days_in_view(reservation).length} text={reservation.name} status={status_class} />;
    });

    return (
        <tr className='room_row'>
            <th>{room.name} ({capacity})</th>
            {cells}
        </tr>
    );
}

export function ReservationBlock(props){
    return <td colSpan={props.days} className={props.status}>{props.text}</td>
}