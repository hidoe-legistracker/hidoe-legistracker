import React, { useState } from 'react';
import Calendar from 'react-calendar';

const BillCalendar = () => {
  const [date, setDate] = useState(new Date());

  // eslint-disable-next-line no-shadow
  const onChange = date => {
    setDate(date);
  };

  return (
    <div>
      <Calendar onChange={onChange} value={date} />
    </div>
  );
};

render(<BillCalendar />, )

export default BillCalendar;
