window.onload = calendarInit();

import { getFormatDate } from "./date.js";

const prev_button = document.getElementsByClassName('prev_btn')[0];
const next_button = document.getElementsByClassName('next_btn')[0];
const cal_descript = document.getElementsByClassName('calendar_descript_container')[0];

function renderCalendar(today){
    const cur_year = today.getFullYear();
    const cur_month = today.getMonth();
    const cur_date = today.getDate();

    const start_day = new Date(cur_year, cur_month, 0);
    const prev_date = start_day.getDate();
    const prev_day = start_day.getDay();

    const end_day = new Date(cur_year, cur_month + 1, 0);
    const next_date = end_day.getDate();
    const next_day = end_day.getDay();

    document.querySelector('.year_month').innerHTML = 
    `<span class = 'year'> ${cur_year}년 </span>&nbsp<span class = 'year'> ${cur_month + 1}월 </span>`;
    
    let calendar = document.querySelector('.dates');
    console.log(calendar);
    calendar.innerHTML = "";

    for(let i = prev_date - prev_day + 1; i <= prev_date;  i++){
        calendar.insertAdjacentHTML("beforeend", `<div class="day prev disable"> ${i} </div>`);
    }

    for(let i = 1; i <= next_date;  i++){
        calendar.insertAdjacentHTML("beforeend", `<div class="day current"> ${i} </div>`);
    }

    for(let i = 1; i <= (7 - next_day == 7 ? 0 : 7 - next_day); i++){
        calendar.insertAdjacentHTML("beforeend", `<div class="day next disable"> ${i} </div>`);
    }

    let curMonthDate = document.querySelectorAll('.dates .current');
    curMonthDate[cur_date - 1].classList.add('today');
}

function calendarInit(){
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
    const ket_gap = 9 * 60 * 60 * 1000;
    const today = new Date(utc + ket_gap);

    renderCalendar(today);
}

function getCalendar(type){
    let month = Number(cal_descript.getAttribute('month'));
    let year = Number(cal_descript.getAttribute('year'));

    switch(type){
        case 'next':
            year = month == 12? Number(year) + 1 : Number(year);
            month = month == 12? 0 : Number(month);
            break;
        case 'prev':
            year = month == 1? Number(year) - 1 : Number(year);
            month = month == 1? 11 : Number(month) - 2;
            break;
    }

    fetch('/getdate', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            year: year,
            month: month
        })
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        let str = "";
        for(let i = 0; i < data.calendars.length; i++){
            str += "<li class = \"calendar_descript_individual\">";
            str += "    <span class = \"calendar_descript_title\">" + getFormatDate(data.calendars[i].date) + "</span>";
            str += "    <span class = \"calendar_descript_content\">" + data.calendars[i].content  + "</span>";
            str += "</li>";
        }
        cal_descript.innerHTML = str;
        month = Number(month);
        cal_descript.setAttribute('month', Number(month) + 1);
        cal_descript.setAttribute('year', year);
        renderCalendar(new Date(year, month, 1));
    })
    .catch((err) => {
        console.log(err);
    })
}

next_button.addEventListener('click', () => {
    getCalendar('next');
});
prev_button.addEventListener('click', () => {
    getCalendar('prev');
});