import './Datepicker.css';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import isBetween from 'dayjs/plugin/isBetween';
import { useEffect, useState } from 'react';

dayjs.extend(updateLocale);
dayjs.extend(isBetween);
dayjs.updateLocale('en', {
  weekdays: [
    0, 1, 2, 3, 4, 5, 6
  ]
});

function Datepicker() {
  const [currentTime, setCurrentTime] = useState(null);
  const [selectTime, setSelectTime] = useState(null);
  const [selectStartTime, setSelectStartTime] = useState(null);
  const [selectEndTime, setSelectEndTime] = useState(null);
  const [displayDay, setDisplayDay] = useState([]);


  const getDisplayDay = (targetTime) => {
    const result = [];
    const currentStartOfDate = dayjs(targetTime).startOf('month').format('YYYY/MM/DD/dddd');
    const currentEndOfDate = dayjs(targetTime).endOf('month').format('YYYY/MM/DD/dddd');
    let prevEndOfDate, nextEndOfDate;
    
    let start = 1;
    let i = currentStartOfDate.slice(-1);
    while (start <= currentEndOfDate.slice(8, 10)) {
      result[i] = currentStartOfDate.slice(0, 8) + start;
      start++;
      i++;
    };

    if (currentEndOfDate.slice(-1) !== 6) {
      nextEndOfDate = dayjs(targetTime).add(1, 'M').startOf('month').format('YYYY/MM/DD/dddd');

      start = 1;
      for (i; i < 35 ; i++) {
        result[i] = nextEndOfDate.slice(0, 8) + start;
        start++;
      };
    };

    if (currentStartOfDate.slice(-1) !== 0) {
      prevEndOfDate = dayjs(targetTime).subtract(1, 'M').endOf('month').format('YYYY/MM/DD/dddd');

      start = prevEndOfDate.slice(8, 10);
      for (i = Number(currentStartOfDate.slice(-1)) - 1; i >= 0 ; i--) {
        result[i] = prevEndOfDate.slice(0, 8) + start;
        start--;
      };
    };
    
    setDisplayDay(result);
  };

  const getInitTime = () => {
    const currentTime = dayjs().format('YYYY/MM/DD');
    setCurrentTime(currentTime);
    setSelectTime(currentTime);
  };

  useEffect(() => {
    getInitTime();
  }, []);

  useEffect(() => {
    getDisplayDay(currentTime);
  }, [currentTime]);

  const handleMonthChange = (isNext) => {
    let targetTime;
    if (isNext) {
      targetTime = dayjs(selectTime).add(1, 'M').format('YYYY/MM/01');
    } else {
      targetTime = dayjs(selectTime).subtract(1, 'M').format('YYYY/MM/01');
    };

    setSelectTime(targetTime);
    getDisplayDay(targetTime);
  };

  const DateButton = () => {
    const currentStartOfDate = dayjs(currentTime).startOf('month').format('YYYY/MM/DD');
    const selectStartOfDate = dayjs(selectTime).startOf('month').format('YYYY/MM/DD');
    const selectEndOfDate = dayjs(selectTime).endOf('month').format('YYYY/MM/DD');

    return displayDay?.map((day) => {
      const formatDay = dayjs(day).format('YYYY/MM/DD');
      const isToday = formatDay === currentTime;
      const isNonSelectMonth = formatDay.localeCompare(selectStartOfDate) === -1 || formatDay.localeCompare(selectEndOfDate) === 1;
      const isDisable = formatDay.localeCompare(currentStartOfDate) === -1;
      const isActive = formatDay === selectStartTime || formatDay === selectEndTime || dayjs(formatDay).isBetween(selectStartTime, selectEndTime) ;

      return (
        <div key={day} className={`date-button  ${isNonSelectMonth ? 'non' : ''} ${isDisable ? 'disable' : ''} ${isActive ? 'active' : ''} ${isToday ? 'today' : ''} `}
          onClick={(e) => handleDateClick(e, day)}
        >
          {day?.slice(8, 10)}日
        </div>
      );
    });
  };

  const handleDateClick = (e, day) => {
    if (e.target.classList.contains('disable')) return;

    const formatDay = dayjs(day).format('YYYY/MM/DD');
    if (!selectStartTime || selectEndTime || formatDay.localeCompare(selectStartTime) === -1) {
      setSelectStartTime(formatDay);
      setSelectEndTime(null);
    } else {
      setSelectEndTime(formatDay);
    };
  };

  return (
    <div className='layout'>
      <div className='header'>
        <button className='select-button' onClick={() => handleMonthChange(false)}>{'<'}</button>
        <span>{`${selectTime?.slice(0, 4)}年${selectTime?.slice(5, 7)}月`}</span>    
        <button className='select-button' onClick={() => handleMonthChange(true)}>{'>'}</button>    
      </div>
      <div className='date-body'>
        {DateButton()}
      </div>
    </div>
  );
}

export default Datepicker;
