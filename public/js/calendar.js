$(document).ready(function(){
    calendarInit();
});

const prev_button = document.getElementsByClassName('go-prev')[0]
const next_button = document.getElementsByClassName('go-next')[0]
const cal_discript = document.getElementById('cal_discript')

function calendarInit(){
    var date = new Date();
    var utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
    var kstGap = 9 * 60 * 60 * 1000;
    var today = new Date(utc + kstGap);

    var thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var currentYear = thisMonth.getFullYear();
    var currentMonth = thisMonth.getMonth();
    var currentDate = thisMonth.getDate();

    renderCalendar(thisMonth);

    function renderCalendar(thisMonth){
        currentYear = thisMonth.getFullYear();
        currentMonth = thisMonth.getMonth();
        currentDate = thisMonth.getDate();

        var startDay = new Date(currentYear, currentMonth, 0);
        var prevDate = startDay.getDate();
        var prevDay = startDay.getDay();

        var endDay = new Date(currentYear, currentMonth + 1, 0);
        var nextDate = endDay.getDate();
        var nextDay = endDay.getDay();

        $('.year-month').text(currentYear + '년 ' + (currentMonth + 1) + '월');
        
        var calendar = document.querySelector('.dates');
        calendar.innerHTML = '';

        for(var i = prevDate - prevDay + 1; i <= prevDate;  i++){
            calendar.innerHTML = calendar.innerHTML + '<div class="day prev disable">' + i + '</div>';
        }

        for(var i = 1; i <= nextDate;  i++){
            calendar.innerHTML = calendar.innerHTML + '<div class="day current">' + i + '</div>';
        }

        for(var i = 1; i <= (7 - nextDay == 7 ? 0 : 7 - nextDay); i++){
            calendar.innerHTML = calendar.innerHTML + '<div class="day next disable">' + i + '</div>';
        }

        if(today.getMonth() == currentMonth){
            var todayDate = today.getDate();
            var currentMonthDate = document.querySelectorAll('.dates .current');
            currentMonthDate[todayDate - 1].classList.add('today');
        }
    }

    $('.go-prev').on('click', function(){
        thisMonth = new Date(currentYear, currentMonth - 1, 1);
        renderCalendar(thisMonth);
    });

    $('.go-next').on('click', function(){
        thisMonth = new Date(currentYear, currentMonth + 1, 1);
        renderCalendar(thisMonth);
    });
}

function getFormatDate(date){
    var newDate = new Date(date);
    var month = newDate.getMonth();
    month = month + 1 >= 10 ? month + 1: '0' + (month + 1 );
    var day = newDate.getDate();
    day = day >= 10 ? day: '0' + day;
    return month + '-' + day;
}


next_button.addEventListener('click', function(e){
    let month = cal_discript.getAttribute('month');
    let year = cal_discript.getAttribute('year');
    month = month == 12? 0: month;
    year = month == 12? year + 1: year;
    console.log("prev month = " + month);

    fetch('http://localhost:4000/get-date', {
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
        var str = ""
        for(var i = 0; i < data.calendars.length; i++){
            str += "<li class = \"cal_title\">";
            str += "    <span class = \"bold cal_text\">" + getFormatDate(data.calendars[i].date) + "</span>";
            str += "    <span class = \"cal_date_content cal_text left_margin\">" + data.calendars[i].content  + "</span>";
            str += "</li>";
        }
        console.log(str);
        cal_discript.innerHTML = str;
        month *= 1;
        month += 1;
        cal_discript.setAttribute('month', month)
        cal_discript.setAttribute('year', year)
    })
    .catch((err) => {
        console.log(err)
    })
})

prev_button.addEventListener('click', function(e){
    let month = cal_discript.getAttribute('month');
    let year = cal_discript.getAttribute('year');
    month = month == 1? 11: month - 2;
    year = month == 1? year - 1: year;
    console.log("next month = " + month);


    fetch('http://localhost:4000/get-date', {
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
        console.log(data)
        var str = ""
        for(var i = 0; i < data.calendars.length; i++){
            str += "<li class = \"cal_title\">";
            str += "    <span class = \"bold cal_text\">" + getFormatDate(data.calendars[i].date) + "</span>";
            str += "    <span class = \"cal_date_content cal_text left_margin\">" + data.calendars[i].content  + "</span>";
            str += "</li>";
        }
        console.log(str);
        cal_discript.innerHTML = str;
        month *= 1;
        month += 1;
        cal_discript.setAttribute('month', month)
        cal_discript.setAttribute('year', year)
    })
    .catch((err) => {
        console.log(err)
    })
})