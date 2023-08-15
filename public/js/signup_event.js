const id_chk_btn = document.querySelector("#id_chk");
const password_input = document.querySelector("#password");
const password_check_input = document.querySelector("#password_chk");
const signup_btn = document.querySelector("#signup");
const id_label = document.querySelector("#id");
const email_input = document.querySelector("#email");

id_chk_btn.addEventListener('click', () => {
    const result_txt = document.querySelectorAll("span.check_result[name=id]")[0];
    const id_txt = document.querySelector("#id").value;

    const id_regex = /^[a-zA-Z0-9]{6,}$/;

    if(id_regex.test(id_txt)){
        import('./auth.js').then((obj) => {
            const check_result = obj.checkIDExist(id_txt);
            if(check_result){
                result_txt.style.color = "#810000";
                result_txt.textContent = "중복된 아이디입니다.";
            } else {
                result_txt.style.color = "#D5D5D5";
                result_txt.textContent = "가입 가능한 아이디입니다."; 
            }
        });
    } else {
        result_txt.style.color = "#810000";
        result_txt.textContent = "아이디가 작성 조건에 맞지 않습니다.";
    }
});

id_label.addEventListener("change", () => {
    const result_txt = document.querySelectorAll("span.check_result[name=id]")[0];
    if(result_txt.textContent != ""){
        result_txt.textContent = "";
    }
});

password_input.addEventListener("change", () => {
    const password = document.querySelector("#password").value;
    const result_txt = document.querySelectorAll("span.check_result[name=password]")[0];

    import('./auth.js').then((obj) => {
        const check_result = obj.checkPasswordRegex(password);
        if(!check_result){
            result_txt.style.color = "#810000";
            result_txt.textContent = "비밀번호가 작성 조건에 맞지 않습니다.";
        } 
    });
})

password_check_input.addEventListener("change", () => {
    const password = document.querySelector("#password").value;
    const result_txt = document.querySelectorAll("span.check_result[name=password_chk]")[0];

    if(password != document.querySelector("#password_chk").value){
        result_txt.style.color = "#810000";
        result_txt.textContent = "일치하지 않습니다.";
    } else {
        result_txt.style.color = "#D5D5D5";
        result_txt.textContent = "일치합니다.";
    }
});

email_input.addEventListener("change", () => {
    const email = email_input.value;
    const result_txt = document.querySelectorAll("span.check_result[name=email]")[0];

    import('./auth.js').then((obj) => {
        const check_result = obj.checkEmailRegex(email);
        if(!check_result){
            result_txt.style.color = "#810000";
            result_txt.textContent = "이메일 형식에 맞지 않습니다.";
        } 
    });
})

signup_btn.addEventListener("click", () => {
    const password = document.querySelector("#password").value;
    const email = document.querySelector("#email").value;

    fetch('/signup/result', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
            user_id: document.querySelector("#id").value,
            password: password,
            email: email
        })
    })
    .then((response) => response.json())
    .then((data) => { 
        window.location.href = data.redirect_url;
    })
    .catch((error) => console.log("error:", error));
});
