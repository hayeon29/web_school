const prevmeal = document.getElementById("prevmeal")
const nextmeal = document.getElementById("nextmeal")
const rec_item_descript = document.getElementById("rec_item_descript")

function getMealFormatDate(date){
    var newDate = new Date(date);
    var month = newDate.getMonth();
    month = month + 1 >= 10 ? month + 1: '0' + (month + 1 );
    var day = newDate.getDate();
    day = day >= 10 ? day: '0' + day;
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dayOfWeek = week[newDate.getDay()];
    return month + '/' + day + '(' + dayOfWeek + ')';
}

function getFormatDate(date){
    var newDate = new Date(date);
    var year = newDate.getFullYear();
    var month = newDate.getMonth();
    month = month + 1 >= 10 ? month + 1: '0' + (month + 1 );
    var day = newDate.getDate();
    day = day >= 10 ? day: '0' + day;
    return year + '-' + month + '-' + day;
}

function setMeal(data){
    var str = "";
    str += "<div>";
    str += "    <div class = \"meal cur\" value=\"1\">";
    str += "        <img class = \"item_img\" src = " + data.schoolmeals[0].image + ">";
    str += "        <div class = \"meal_cur_menu\">";
    str += "            <span class = \"bold\">" + getMealFormatDate(data.schoolmeals[0].date) + " " + data.schoolmeals[0].value +"</span>";
    str += "            <hr style=\"visibility: hidden;\"/>";
    str += "            <ol class=\"breakfast\">";
    for(var i = 0; i < data.schoolmeals[0].meal.length; i++){
        str += "                <li>" + data.schoolmeals[0].meal[i] + "</li>"; 
    }
    str += "            </ol>"
    str += "        </div>"
    str += "    </div>"
    str += "    <div class = \"hidden meal\" value=\"2\">";
    str += "        <img class = \"item_img\" src = " + data.schoolmeals[1].image + ">";
    str += "        <div class = \"meal_cur_menu\">";
    str += "            <span class = \"bold\">" + getMealFormatDate(data.schoolmeals[1].date) + " " + data.schoolmeals[1].value +"</span>";
    str += "            <hr style=\"visibility: hidden;\"/>";
    str += "            <ol class=\"lunch\">";
    for(var i = 0; i < data.schoolmeals[1].meal.length; i++){
        str += "                <li>" + data.schoolmeals[1].meal[i] + "</li>"; 
    }
    str += "            </ol>"
    str += "        </div>"
    str += "    </div>"
    str += "    <div class = \"hidden meal\" value=\"3\">";
    str += "        <img class = \"item_img\" src = " + data.schoolmeals[2].image + ">";
    str += "        <div class = \"meal_cur_menu\">";
    str += "            <span class = \"bold\">" + getMealFormatDate(data.schoolmeals[2].date) + " " + data.schoolmeals[2].value +"</span>";
    str += "            <hr style=\"visibility: hidden;\"/>";
    str += "            <ol class=\"dinner\">";
    for(var i = 0; i < data.schoolmeals[2].meal.length; i++){
        str += "                <li>" + data.schoolmeals[2].meal[i] + "</li>"; 
    }
    str += "            </ol>"
    str += "        </div>"
    str += "    </div>"
    str += "</div>";

    return str;
}

function setNoMeal(data, date){
    var str = "";
    str += "<div>";
    str += "    <div class = \"meal cur\" value=\"1\">";
    str += "        <img class = \"item_img\" src = " + data.schoolmeals[0].image + ">";
    str += "        <div class = \"meal_cur_menu\">";
    str += "            <span class = \"bold\">" + getMealFormatDate(date) + " 조식</span>";
    str += "            <hr style=\"visibility: hidden;\"/>";
    str += "            <ol class=\"breakfast\">";
    str += "                <li> 급식 정보가 없습니다. </li>"; 
    str += "            </ol>"
    str += "        </div>"
    str += "    </div>"
    str += "    <div class = \"hidden meal\" value=\"2\">";
    str += "        <img class = \"item_img\" src = " + data.schoolmeals[1].image + ">";
    str += "        <div class = \"meal_cur_menu\">";
    str += "            <span class = \"bold\">" + getMealFormatDate(date) + " 중식</span>";
    str += "            <hr style=\"visibility: hidden;\"/>";
    str += "            <ol class=\"lunch\">";
    str += "                <li> 급식 정보가 없습니다. </li>"; 
    str += "            </ol>"
    str += "        </div>"
    str += "    </div>"
    str += "    <div class = \"hidden meal\" value=\"3\">";
    str += "        <img class = \"item_img\" src = " + data.schoolmeals[2].image + ">";
    str += "        <div class = \"meal_cur_menu\">";
    str += "            <span class = \"bold\">" + getMealFormatDate(date) + " 석식</span>";
    str += "            <hr style=\"visibility: hidden;\"/>";
    str += "            <ol class=\"dinner\">";
    str += "                <li> 급식 정보가 없습니다. </li>"; 
    str += "            </ol>"
    str += "        </div>"
    str += "    </div>"
    str += "</div>";

    return str;
}

prevmeal.addEventListener('click', function(e){
    var curMenu = Number($(".meal.cur").attr("value"));
    var todayMenu = $(".meal");
    if(curMenu > 1){ //점심, 또는 저녁일 때
        todayMenu.eq(curMenu - 1).removeClass("cur");
        todayMenu.eq(curMenu - 1).addClass("hidden");
        todayMenu.eq(curMenu - 2).removeClass("hidden");
        todayMenu.eq(curMenu - 2).addClass("cur");
    } else { //아침일 때 
        //날짜 변경
        var curDate = document.getElementsByClassName("rec_item")[0].getAttribute("date");
        var prevDate = new Date(curDate);
        prevDate = prevDate.setDate(prevDate.getDate() - 1);

        fetch('http://localhost:4000/get-meal-date', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: prevDate
            })
        })
        .then((response) => response.json())
        .then((data) => {
            var getDate = new Date(data.schoolmeals[0].date);
            if(prevDate.valueOf() != getDate.valueOf()){
                str = setNoMeal(data, prevDate);
                rec_item_descript.innerHTML = str;
            } else {
                str = setMeal(data);
                rec_item_descript.innerHTML = str;
            }
            document.getElementsByClassName('rec_item')[0].setAttribute('date', getFormatDate(prevDate));
        })
        .catch((err) => {
            console.log(err)
        })
    }
})
nextmeal.addEventListener('click', function(e){
    var curMenu = Number($(".meal.cur").attr("value"));
    var todayMenu = $(".meal");
    if(curMenu < 3){ //아침, 또는 점심일 때
        todayMenu.eq(curMenu - 1).removeClass("cur");
        todayMenu.eq(curMenu - 1).addClass("hidden");
        todayMenu.eq(curMenu).removeClass("hidden");
        todayMenu.eq(curMenu).addClass("cur");
    } else { //저녁일 때 
        //날짜 변경 
        var curDate = document.getElementsByClassName("rec_item")[0].getAttribute("date");
        var nextDate = new Date(curDate);
        nextDate = nextDate.setDate(nextDate.getDate() + 1);

        fetch('http://localhost:4000/get-meal-date', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: nextDate
            })
        })
        .then((response) => response.json())
        .then((data) => {
            var getDate = new Date(data.schoolmeals[0].date);
            if(nextDate.valueOf() != getDate.valueOf()){
                str = setNoMeal(data, nextDate);
                rec_item_descript.innerHTML = str;
            } else {
                str = setMeal(data);
                rec_item_descript.innerHTML = str;
            }
            document.getElementsByClassName('rec_item')[0].setAttribute('date', getFormatDate(nextDate));
        })
        .catch((err) => {
            console.log(err)
        })
    }
})