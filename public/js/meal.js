function prev_meal(curDate, time){
    var curMenu = Number($(".meal.cur").attr("value"));
    var todayMenu = $(".meal");
    if(curMenu > 1){ //점심, 또는 저녁일 때
        todayMenu.eq(curMenu - 1).removeClass("cur");
        todayMenu.eq(curMenu - 1).addClass("hidden");
        todayMenu.eq(curMenu - 2).removeClass("hidden");
        todayMenu.eq(curMenu - 2).addClass("cur");
    } else { //아침일 때 
        //날짜 변경 
    }
}

function next_meal(curDate, time){
    var curMenu = Number($(".meal.cur").attr("value"));
    var todayMenu = $(".meal");
    if(curMenu < 3){ //아침, 또는 점심일 때
        todayMenu.eq(curMenu - 1).removeClass("cur");
        todayMenu.eq(curMenu - 1).addClass("hidden");
        todayMenu.eq(curMenu).removeClass("hidden");
        todayMenu.eq(curMenu).addClass("cur");
    } else { //저녁일 때 
        //날짜 변경 
    }
}
