import { format } from 'date-fns';
import { ko } from 'date-fns/locale/index.js';

export function getFormatDate(date, formatStr){
    return format(date, formatStr, {locale: ko});
}

export function convertDateToFormat(table, formatStr){
    for(let i = 0; i < table.length; i++){
        table[i].DATE = format(table[i].date, formatStr, {locale: ko});
    }
    return table;
}

export function convertSingleDateToFormat(data, formatStr){
    data.DATE = getFormatDate(data.date, formatStr);
    return data;
}

export function getLastDateOfMonth(date){
    const year = date.getFullYear();
    const month = date.getMonth();
    date = 1;

    switch(month){
        case 0: case 2: case 4: case 6: case 7: case 9: case 11:
            date = 31;
            break;
        case 3: case 5: case 8: case 10:
            date = 30;
            break;
        case 1:
            if(year % 4 == 0) date = 29;
            else date = 28;
    }
    
    const last_date = getFormatDate(new Date(year, month, date), 'yyyy-MM-dd');
    return last_date;
}