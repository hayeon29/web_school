window.onload = initMealCalendar();

function renderMealCalendar(display_way, date) {
  const meal_table = document.getElementById("meal_table");
  const meal_tbody = meal_table.getElementsByTagName("tbody")[0];

  const content_container =
    document.getElementsByClassName("content_container")[0];

  const cur_year = date.getFullYear();
  const cur_month = date.getMonth();
  const cur_date = date.getDate();
  const cur_day = date.getDay();

  const start_day = new Date(cur_year, cur_month, 1);
  const prev_day = start_day.getDay();
  //0: 일요일 ~ 6: 토요일

  const end_day = new Date(cur_year, cur_month + 1, 0);
  const next_date = end_day.getDate();
  const next_day = end_day.getDay();

  let count = 0;
  let tr = null;

  meal_tbody.innerHTML = "";

  if (display_way.toLowerCase() === "monthly") {
    content_container.classList.remove("weekly");
    content_container.classList.add("monthly");
    for (let i = 1 - prev_day; i <= next_date + (6 - next_day); i++) {
      if (count % 7 === 0) tr = document.createElement("tr");
      if (i <= 0 || i > next_date) {
        const td = document.createElement("td");
        td.classList.add("date");
        td.setAttribute("scope", "col");
        tr.appendChild(td);
      } else if (i > 0 && i <= next_date) {
        const td = document.createElement("td");
        td.classList.add("date");
        td.setAttribute("scope", "col");
        td.setAttribute("value", i.toString());
        const date_time_container = document.createElement("div");
        date_time_container.classList.add("date_time_container");
        date_time_container.insertAdjacentHTML(
          "beforeend",
          '<ol> <li class="date_time">아침</li> <li class="date_time cur">점심</li> <li class="date_time">저녁</li></ol>'
        );
        td.appendChild(date_time_container);
        const date_date_container = document.createElement("div");
        date_date_container.classList.add("date_date_container");
        date_date_container.insertAdjacentHTML("beforeend", i.toString());
        td.appendChild(date_date_container);
        const date_meal_container = document.createElement("div");
        date_meal_container.classList.add("date_meal_container");
        date_meal_container.insertAdjacentHTML(
          "beforeend",
          '<ul class="morning"><li class="date_meal_list">메뉴1</li><li class="date_meal_list">메뉴2</li><li class="date_meal_list">메뉴3</li></ul>'
        );
        date_meal_container.insertAdjacentHTML(
          "beforeend",
          '<ul class="lunch cur"><li class="date_meal_list">메뉴1</li><li class="date_meal_list">메뉴2</li><li class="date_meal_list">메뉴3</li></ul>'
        );
        date_meal_container.insertAdjacentHTML(
          "beforeend",
          '<ul class="dinner"><li class="date_meal_list">메뉴1</li><li class="date_meal_list">메뉴2</li><li class="date_meal_list">메뉴3</li></ul>'
        );
        td.appendChild(date_meal_container);
        tr.appendChild(td);
      }
      if (count % 7 === 6) {
        meal_tbody.appendChild(tr);
      }
      count++;
    }

    const week_of_meal_calendar = document.querySelector(
      ".meal_calendar_header span[name='week']"
    );
    week_of_meal_calendar.textContent = "";
  } else if (display_way.toLowerCase() === "weekly") {
    content_container.classList.remove("monthly");
    content_container.classList.add("weekly");
    tr = document.createElement("tr");
    for (let i = cur_date - cur_day; i < cur_date - cur_day + 7; i++) {
      const td = document.createElement("td");
      td.classList.add("date");
      td.setAttribute("scope", "col");
      td.setAttribute("value", i.toString());
      const date_time_container = document.createElement("div");
      date_time_container.classList.add("date_time_container");
      date_time_container.insertAdjacentHTML(
        "beforeend",
        '<ol> <li class="date_time">아침</li> <li class="date_time cur">점심</li> <li class="date_time">저녁</li></ol>'
      );
      td.appendChild(date_time_container);
      const date_date_container = document.createElement("div");
      date_date_container.classList.add("date_date_container");
      date_date_container.insertAdjacentHTML("beforeend", i.toString());
      td.appendChild(date_date_container);
      const date_meal_container = document.createElement("div");
      date_meal_container.classList.add("date_meal_container");
      date_meal_container.insertAdjacentHTML(
        "beforeend",
        '<ul class="morning"><li class="date_meal_list">메뉴1</li><li class="date_meal_list">메뉴2</li><li class="date_meal_list">메뉴3</li></ul>'
      );
      date_meal_container.insertAdjacentHTML(
        "beforeend",
        '<ul class="lunch"><li class="date_meal_list">메뉴1</li><li class="date_meal_list">메뉴2</li><li class="date_meal_list">메뉴3</li></ul>'
      );
      date_meal_container.insertAdjacentHTML(
        "beforeend",
        '<ul class="dinner"><li class="date_meal_list">메뉴1</li><li class="date_meal_list">메뉴2</li><li class="date_meal_list">메뉴3</li></ul>'
      );
      td.appendChild(date_meal_container);
      tr.appendChild(td);
    }
    meal_tbody.appendChild(tr);

    const week_of_day = Math.floor((cur_date + prev_day - 1) / 7);

    const week_of_meal_calendar = document.querySelector(
      ".meal_calendar_header span[name='week']"
    );
    week_of_meal_calendar.textContent = (week_of_day + 1).toString();
  }
}

function changeWeekMonthMenu(target) {
  const selectedMenu = target.getAttribute("for");

  const monthly_button = document.querySelector("label[for='monthly_view']");
  const weekly_button = document.querySelector("label[for='weekly_view']");

  let today_date = new Date();
  if (navigator.language === "en" || navigator.language === "en-US") {
    const utc =
      today_date.getTime() + today_date.getTimezoneOffset() * 60 * 1000;
    const ket_gap = 9 * 60 * 60 * 1000;
    today_date = new Date(utc + ket_gap);
  }

  if (selectedMenu === "weekly_view") {
    if (!target.classList.contains("cur")) {
      target.classList.add("cur");
      monthly_button.classList.remove("cur");
      renderMealCalendar("weekly", today_date);
    }
  } else if (selectedMenu === "monthly_view") {
    if (!target.classList.contains("cur")) {
      target.classList.add("cur");
      weekly_button.classList.remove("cur");
      renderMealCalendar("monthly", today_date);
    }
  }
}

function initMealCalendar() {
  let today_date = new Date();
  if (navigator.language === "en" || navigator.language === "en-US") {
    const utc =
      today_date.getTime() + today_date.getTimezoneOffset() * 60 * 1000;
    const ket_gap = 9 * 60 * 60 * 1000;
    today_date = new Date(utc + ket_gap);
  }

  renderMealCalendar("monthly", today_date);
}
