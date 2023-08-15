const prev_meal = document.querySelector(".meal button.prev_button");
const next_meal = document.querySelector(".meal button.next_button");
const meal_cur_menu = document.querySelectorAll(".meal .cur_menu > ol");
const meal_button_list = document.querySelector(".meal .cur_date_button");

function setMeal(data, value){
    meal_cur_menu.item(value - 1).innerHTML = "";
    for(let i = 0; i < data.school_meal[value - 1].meal.length; i++){
        meal_cur_menu.item(value - 1).insertAdjacentHTML("afterbegin", "<li> " + data.school_meal[value - 1].meal[i] +" </li>");
    }
}

function setNoMeal(value){
    meal_cur_menu.item(value - 1).innerHTML = "";
    meal_cur_menu.item(value - 1).insertAdjacentHTML("afterbegin", "<li> 급식 정보가 없습니다 </li>");
}

function start(data){
    for(let i = 1; i <= 3; i++){
        try{
            setMeal(data, i);
        } catch (TypeError){
            setNoMeal(i);
        }
    }
}

function changeMealDate(target){
    let curDateText = document.querySelector(".meal span.cur_date_date").textContent.trim();
    const cur_date = new Date(curDateText.substring(0, 4), curDateText.substring(6, 8) - '1', curDateText.substring(10, 12));

    let changingDate = cur_date;
    if(target === prev_meal){
        changingDate = changingDate.setDate(cur_date.getDate() - 1);
    } else if(target === next_meal){
        changingDate = changingDate.setDate(cur_date.getDate() + 1);
    }

    fetch('/get-meal-date', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            date: changingDate
        })
    })
    .then((response) => response.json())
    .then((data) => {
        start(data);
        const next_date_date = data.cur_date_date;
        const next_date_week = data.cur_date_week;

        const cur_date_date = document.querySelector(".meal span.cur_date_date");
        cur_date_date.textContent = next_date_date;

        const cur_date_week = document.querySelector(".meal span.cur_date_week");
        cur_date_week.textContent = '(' + next_date_week + ')';

        const cur_cur_button = document.querySelector(".meal .cur_date_button > button.cur");
        const next_cur_button = document.querySelector(".meal .cur_date_button > button[value='1']");
        cur_cur_button.classList.remove("cur");
        next_cur_button.classList.add("cur");
    })
    .catch((err) => {
        console.log(err);
    });
}

meal_button_list.addEventListener('click', (e) => {
    const clicked_target = e.target;
    if(clicked_target.tagName === "BUTTON"){
        const cur_button = document.querySelector(".meal .cur_date_button > button.cur");

        const cur_button_value = Number(cur_button.getAttribute("value"));
        const clicked_button_value = Number(clicked_target.getAttribute("value"));

        cur_button.classList.remove("cur");
        clicked_target.classList.add("cur");

        meal_cur_menu.item(cur_button_value - 1).classList.remove("cur");
        meal_cur_menu.item(clicked_button_value - 1).classList.add("cur");
    }
})

prev_meal.addEventListener('click', function(e){
    changeMealDate(prev_meal);
});

next_meal.addEventListener('click', function(e){
    changeMealDate(next_meal);
});