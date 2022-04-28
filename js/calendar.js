$(document).ready(function(){
    calendarInit();
});

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

