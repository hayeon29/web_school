const id_input = document.querySelector(".input_input[name=id]");
const id_check_button = document.querySelector(".input_check_button[name=id]");
const id_next_button = document.querySelector(".input_next_button[name=id]");

const step_line = document.querySelector(".step_line");

const password_input = document.querySelector(".input_input[name=password]");
const password_check_input = document.querySelector(
  ".input_input[name=password_chk]"
);
const password_next_button = document.querySelector(
  ".input_next_button[name=password]"
);

const nickname_input = document.querySelector(".input_input[name=nickname]");
const nickname_next_button = document.querySelector(
  ".input_next_button[name=nickname]"
);

const signup_btn = document.querySelector("#signup");
const id_label = document.querySelector("#id");

const email_receive_toggle = document.querySelector("#email_receive_toggle");
const email_input = document.querySelector(".input_input[name=email]");
const email_next_button = document.querySelector(
  ".input_next_button[name=email]"
);

const input_return_button = document.querySelector(".input_return_button");

const slide_container = document.querySelector(".each_input_container");
const input_next_button = document.querySelectorAll(".input_next_button");
input_next_button.forEach((event) => {
  event.addEventListener("click", getNextPage);
});

let signupStepNumber = 1;

function getNextPage() {
  if (signupStepNumber == 4) {
    console.log(
      `${id_input.value} ${password_input.value} ${nickname_input.value} ${email_input.value}`
    );
    fetch("/signup/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify({
        id: id_input.value,
        password: password_input.value,
        nickname: nickname_input.value,
        email: email_input.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //return signup page if failed
        if (!data.message === "success") {
          window.location.href = "/signup";
          return;
        }
      })
      .catch((error) => console.log("error:", error));
  }
  const input_container_slide = document.querySelector(
    ".input_container_slide"
  );
  input_container_slide.style.setProperty(
    "margin-left",
    `-${signupStepNumber * slide_container.clientWidth}px`
  );

  step_line.style.setProperty("width", `${signupStepNumber * 25}%`);
  signupStepNumber++;
}

id_input.addEventListener("change", () => {
  const input_id_text = id_input.value;
  const input_result = document.querySelector(".input_result[name=id]");

  const input_check_button = document.querySelector(
    ".input_check_button[name=id]"
  );

  const id_regex = /^[a-zA-Z0-9-_]{8,15}$/;
  if (id_regex.test(input_id_text)) {
    input_result.style.setProperty("color", "#D5D5D5");
    input_result.textContent = "아이디 형식이 올바릅니다.";
    input_check_button.removeAttribute("disabled");
  } else {
    input_result.style.setProperty("color", "#810000");
    input_result.textContent = "만들 수 없는 아이디 형식입니다.";
    if (input_check_button.getAttribute("disabled") === null) {
      input_check_button.setAttribute("disabled", "disabled");
    }
  }
});

id_check_button.addEventListener("click", () => {
  const input_result = document.querySelectorAll(".input_result[name=id]")[0];
  const input_id_text = id_input.value;

  import("./auth.js").then(async (module) => {
    const check_result = await module.checkIDExist(input_id_text);
    if (check_result) {
      input_result.style.setProperty("color", "#810000");
      input_result.textContent = "중복된 아이디입니다.";
      if (id_next_button.getAttribute("disabled") === null) {
        id_next_button.setAttribute("disabled", "disabled");
      }
    } else {
      input_result.style.setProperty("color", "#D5D5D5");
      input_result.textContent = "가입 가능한 아이디입니다.";
      id_next_button.removeAttribute("disabled");
    }
  });
});

password_input.addEventListener("change", () => {
  const password = password_input.value;
  const input_result = document.querySelector(".input_result[name=password]");

  import("./auth.js").then((module) => {
    const check_result = module.checkPasswordRegex(password);
    if (!check_result) {
      input_result.style.setProperty("color", "#810000");
      input_result.textContent = "비밀번호가 작성 조건에 맞지 않습니다.";
      if (password_check_input.getAttribute("disabled") === null) {
        password_check_input.setAttribute("disabled", "disabled");
      }
    } else {
      input_result.textContent = "";
      password_check_input.removeAttribute("disabled");
    }
  });
});

password_check_input.addEventListener("change", () => {
  const password = password_input.value;
  const input_result = document.querySelector(
    ".input_result[name=password_chk]"
  );

  if (password !== password_check_input.value) {
    input_result.style.setProperty("color", "#810000");
    input_result.textContent = "일치하지 않습니다.";
    if (password_check_input.getAttribute("disabled") === null) {
      password_check_input.setAttribute("disabled", "disabled");
    }
  } else {
    input_result.style.setProperty("color", "#D5D5D5");
    input_result.textContent = "일치합니다.";
    password_next_button.removeAttribute("disabled");
  }
});

nickname_input.addEventListener("change", () => {
  const nickname_reg = /^[ㄱ-ㅎ|가-힣]+$/;
  if (nickname_reg.test(nickname_input.value)) {
    nickname_next_button.removeAttribute("disabled");
  } else {
    if (nickname_next_button.getAttribute("disabled") === null) {
      nickname_next_button.setAttribute("disabled", "disabled");
    }
  }
});

email_receive_toggle.addEventListener("change", (event) => {
  if (event.currentTarget.checked) {
    if (email_next_button.getAttribute("disabled") === null) {
      email_next_button.setAttribute("disabled", "disabled");
    }
  } else {
    email_next_button.removeAttribute("disabled");
  }
});

email_input.addEventListener("change", () => {
  const email = email_input.value;
  const input_result = document.querySelector(".input_result[name=email]");

  import("./auth.js").then((module) => {
    const check_result = module.checkEmailRegex(email);
    if (!check_result) {
      input_result.style.setProperty("color", "#810000");
      input_result.textContent = "이메일 형식에 맞지 않습니다.";
      if (email_next_button.getAttribute("disabled") === null) {
        email_next_button.setAttribute("disabled", "disabled");
      }
    } else {
      email_next_button.removeAttribute("disabled");
    }
  });
});

input_return_button.addEventListener("click", () => {
  window.location.href = "/";
});
