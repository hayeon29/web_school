export function getFormatDate(date){
    const new_date = new Date(date);
    let month = new_date.getMonth();
    month = month + 1 >= 10 ? month + 1: '0' + (month + 1 );
    let day = new_date.getDate();
    day = day >= 10 ? day: '0' + day;
    return month + '-' + day;
}

export function getFormatDateWithWeek(date){
    const new_date = new Date(date);
    let month = new_date.getMonth();
    month = month + 1 >= 10 ? month + 1: '0' + (month + 1 );
    let day = new_date.getDate();
    day = day >= 10 ? day: '0' + day;
    const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day_of_week = week[new_date.getDay()];
    return month + '/' + day + '(' + day_of_week + ')';
}
