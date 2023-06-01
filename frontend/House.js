import { useRecords, colorUtils } from '@airtable/blocks/ui';
import React from 'react';
import { Room } from './Room';


export function House(props) {
    const house = props.house;
    const color_field = house.getCellValue("Color");
    const color_hex = colorUtils.getHexForColor(color_field.color);
    const color_bar_style = { backgroundColor: color_hex};
    const rooms = useRecords(house.selectLinkedRecordsFromCell('Rooms'))
    const room_list = rooms.map(room => <Room key={room.id} room={room} {...props}/>)
    const number_of_rooms = () => {
        if(room_list.length == 0){
            return null;
        }else{
            return room_list.length + 1
        }
    }
    
    return (
        <React.Fragment>
            <tr className='house_row'>
                <th rowSpan={number_of_rooms()} style={color_bar_style} className='color'></th>
                <th rowSpan={number_of_rooms()}>
                    {house.name}
                </th>
            </tr>
            {room_list}
        </React.Fragment>
    );
}

export function HouseList(props) {
    const house_table = props.base.getTableByName("Houses");
    const houses = useRecords(house_table);
    const house_list = houses.map(house => <House key={house.id} house={house} {...props} />);

    return <tbody>{house_list}</tbody>;
}
