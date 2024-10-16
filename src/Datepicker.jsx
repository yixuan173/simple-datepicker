import './Datepicker.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useEffect, useState } from 'react';

dayjs.extend(isBetween);

const DATE_FORMAT = "YYYY/MM/DD";

function Datepicker() {
  const [currentTime, setCurrentTime] = useState(null);
  const [selectTime, setSelectTime] = useState(null);
  const [selectStartTime, setSelectStartTime] = useState(null);
  const [selectEndTime, setSelectEndTime] = useState(null);
  const [displayDay, setDisplayDay] = useState([]);


  const getDisplayDay = (targetTime) => {
    const result = [];
    const currentStartOfDate = dayjs(targetTime).startOf('month').format(DATE_FORMAT);
    const currentStartOfWeekday = dayjs(targetTime).startOf('month').format('d');
    const currentEndOfDate = dayjs(targetTime).endOf('month').format(DATE_FORMAT);
    const currentEndOfWeekday = dayjs(targetTime).endOf('month').format('d');
    
    let start = 1;
    let i = currentStartOfWeekday;
    while (start <= currentEndOfDate.slice(8)) {
      result[i] = currentStartOfDate.slice(0, 8) + start;
      start++;
      i++;
    };

    if (currentEndOfWeekday !== 6) {
      const nextStartOfDate = dayjs(targetTime).add(1, 'M').format('YYYY/MM/');

      start = 1;
      while (start <= 6 - Number(currentEndOfWeekday)) {
        result[i] = nextStartOfDate + start;
        start++;
        i++;
      }
    };

    if (currentStartOfWeekday !== 0) {
      const prevEndOfDate = dayjs(targetTime).subtract(1, 'M').endOf('month').format(DATE_FORMAT);
      
      start = prevEndOfDate.slice(8);
      for (i = Number(currentStartOfWeekday) - 1; i >= 0 ; i--) {
        result[i] = prevEndOfDate.slice(0, 8) + start;
        start--;
      };
    };
    
    setDisplayDay(result);
  };

  const getInitTime = () => {
    const currentTime = dayjs().format(DATE_FORMAT);
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
      targetTime = dayjs(selectTime).add(1, 'M').format(DATE_FORMAT);
    } else {
      targetTime = dayjs(selectTime).subtract(1, 'M').format(DATE_FORMAT);
    };

    setSelectTime(targetTime);
    getDisplayDay(targetTime);
  };

  const DateButton = () => {
    const currentStartOfDate = dayjs(currentTime).startOf('month').format(DATE_FORMAT);
    const selectStartOfDate = dayjs(selectTime).startOf('month').format(DATE_FORMAT);
    const selectEndOfDate = dayjs(selectTime).endOf('month').format(DATE_FORMAT);

    return displayDay?.map((day) => {
      const formatDay = dayjs(day).format(DATE_FORMAT);
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

    const formatDay = dayjs(day).format(DATE_FORMAT);
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
