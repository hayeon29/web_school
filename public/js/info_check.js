const mypage_info_submit = document.querySelector("#mypage_info_submit");
const mypage_email_change_button = document.querySelector("button#email");
const mypage_password_change_button = document.querySelector("button#password");
const email_input = document.querySelector("#email_change");
const email_change_button = document.querySelector("#email_change_button");

function addEvent(){
    let is_cur_chk_true = false;
    let change_true = false;
    let change_chk_true = false;

    const password_cur_chk_btn = document.querySelector("#password_cur_chk");
    password_cur_chk_btn.addEventListener('click', () => {
        import('./auth.js').then(async(obj) => {
            const password_cur = document.querySelector("#password_cur").value;
            const result_txt = document.querySelectorAll("p.check_result[name=password_cur]")[0];
            const check_result = await obj.checkPassword(password_cur);
            if(!check_result){
                result_txt.style.color = "#810000";
                result_txt.textContent = "틀린 비밀번호입니다.";
                is_cur_chk_true = false;
            } else {
                result_txt.style.color = "#D5D5D5";
                result_txt.textContent = "일치합니다.";
                is_cur_chk_true = true;
            }
        });
    });

    const password_change = document.querySelector("#password_change");
    password_change.addEventListener('change', () => {
        const password = password_change.value;
        const result_txt = document.querySelectorAll("p.check_result[name=password_change]")[0];

        import('./auth.js').then((obj) => {
            const check_result = obj.checkPasswordRegex(password);
            if(!check_result){
                result_txt.style.color = "#810000";
                result_txt.textContent = "비밀번호가 작성 조건에 맞지 않습니다.";
                change_true = false;
            } else {
                result_txt.textContent = "";
                change_true = true;
            }
        });
    })

    const password_change_chk = document.querySelector("#password_change_chk");
    password_change_chk.addEventListener('change', () => {
        const password_chk = password_change_chk.value;
        const result_txt = document.querySelectorAll("p.check_result[name=password_change_chk]")[0];
        if(password_chk != password_change.value){
            result_txt.style.color = "#810000";
            result_txt.textContent = "일치하지 않습니다.";
            change_chk_true = false;
        } else {
            result_txt.style.color = "#D5D5D5";
            result_txt.textContent = "일치합니다.";
            change_chk_true = true;
        }
    });

    const edit_button = document.querySelector("#mypage_info_edit");
    
    edit_button.addEventListener('click', () => {
        const password_cur = document.querySelector("#password_cur").value;
        const password = password_change.value;

        if(is_cur_chk_true && change_true && change_chk_true){
            import('./cookie.js').then(async(obj) => {
                const cookie_id = obj.getCookie("user_id");
                fetch('/edit-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({
                        user_id: cookie_id,
                        password_cur: password_cur,
                        password_change: password,
                    }) 
                }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if(data.message == "SUCCESS"){
                        window.alert("비밀번호가 변경되었습니다.");
                        window.location.href = data.redirect_url;
                    } else {
                        window.alert("오류가 발생했습니다.", data.message);
                        window.location.href = data.redirect_url;
                    }
                });
            });
            
        }
    });
}

function add_password_change_form(){
    const article_content = document.querySelector(".article_content");
                    
    const table_content = document.createElement("table");
    table_content.classList.add("table_content");
    let table_tr = []; //각 입력창의 행 container
    let td_one = []; //각 입력창 왼쪽
    let td_two = []; //각 입력창, 확인 버튼
    let myinfo_desc = []; //각 입력창 설명(title)
    let myinfo_input = []; //각 입력창(input)
    let check_span = []; //각 입력 결과 출력(T/F, span)
    for(let i = 0; i < 3; i++){
        table_tr[i] = document.createElement("tr");

        td_one[i] = document.createElement("td");
        td_one[i].classList.add("table_td_one");

        td_two[i] = document.createElement("td");
        td_two[i].classList.add("table_td_two");

        myinfo_desc[i] = document.createElement("span");
        myinfo_desc[i].classList.add("table_td_title");
        
        myinfo_input[i] = document.createElement("input");

        check_span[i] = document.createElement("p");
        check_span[i].classList.add("check_result");
    }

    //현재 비밀번호
    let password_chk_btn = document.createElement("button");
    myinfo_desc[0].innerText = "현재 비밀번호";
    td_one[0].appendChild(myinfo_desc[0]);
    //현재 비밀번호 입력창
    myinfo_input[0].id = "password_cur";
    myinfo_input[0].setAttribute("type", "password");
    myinfo_input[0].setAttribute("placeholder", "현재 사용하는 비밀번호를 입력해주세요");
    //비밀번호 맞는지 확인
    check_span[0].setAttribute("name", "password_cur");
    //비밀번호 확인 버튼
    password_chk_btn.setAttribute("type", "button");
    password_chk_btn.classList.add("button", "default_button");
    password_chk_btn.innerHTML = "확인";
    password_chk_btn.id = "password_cur_chk";
    td_two[0].appendChild(myinfo_input[0]);
    td_two[0].appendChild(password_chk_btn);
    td_two[0].appendChild(check_span[0]);

    table_tr[0].appendChild(td_one[0]);
    table_tr[0].appendChild(td_two[0]);


    //변경 비밀번호
    myinfo_desc[1].innerText = "변경 비밀번호";
    td_one[1].appendChild(myinfo_desc[1]);
    //변경 비밀번호 입력창
    myinfo_input[1].id = "password_change";
    myinfo_input[1].setAttribute("type", "password");
    myinfo_input[1].setAttribute("placeholder", "변경할 비밀번호를 입력해주세요");
    //비밀번호 유효성 검증
    check_span[1].setAttribute("name", "password_change");
    td_two[1].appendChild(myinfo_input[1]);
    td_two[1].appendChild(check_span[1]);

    table_tr[1].appendChild(td_one[1]);
    table_tr[1].appendChild(td_two[1]);


    //변경 비밀번호 확인
    myinfo_desc[2].id = "myinfo_checkPassword_change";
    myinfo_desc[2].innerText = "변경 비밀번호 확인";
    td_one[2].appendChild(myinfo_desc[2]);
    //변경 확인 입력창
    myinfo_input[2].id = "password_change_chk";
    myinfo_input[2].setAttribute("type", "password");
    myinfo_input[2].setAttribute("placeholder", "변경할 비밀번호를 한 번 더 입력해주세요");
    //변경 확인 동일성 검증
    check_span[2].setAttribute("name", "password_change_chk");
    td_two[2].appendChild(myinfo_input[2]);
    td_two[2].appendChild(check_span[2]);

    table_tr[2].appendChild(td_one[2]);
    table_tr[2].appendChild(td_two[2]);

    for(let i = 0; i < 3; i++){
        table_content.appendChild(table_tr[i]);
    }

    //수정 버튼
    let edit_button = document.createElement("button");
    edit_button.id = "mypage_info_edit";
    edit_button.classList.add("button", "large_button");
    edit_button.innerHTML = "수정하기";

    article_content.innerHTML = "";
    article_content.appendChild(table_content);
    article_content.appendChild(edit_button);

    if(document.querySelector("#popup_dim") !== null){
        document.querySelector("#popup_dim").remove();
    }

    addEvent();
}

mypage_email_change_button.addEventListener('click', () => {
    const popup_dim = document.querySelector("#popup_dim");
    popup_dim.style.display = "block";
    window.scrollTo({top:0, left:0, behavior:'auto'});
    document.querySelector("body").style.overflow = "hidden";

    popup_dim.addEventListener('mousedown', (event) => {
        if(event.target == popup_dim){
            popup_dim.style.display = "none";
            document.querySelector("body").style.overflow = "unset";
        }
    });

    const popup_exit = document.querySelector("#popup_exit");
        popup_exit.addEventListener('click', () => {
            popup_dim.style.display = "none";
            document.querySelector("body").style.overflow = "unset";
        }
    );
});

mypage_password_change_button.addEventListener('click', () => {
    let mypage_info_check = document.createElement("p");
    mypage_info_check.setAttribute("for", "mypage_info_check");
    mypage_info_check.innerHTML = "정보 접근을 위해 비밀번호를 입력해주세요";

    let mypage_info_check_input = document.createElement("input");
    mypage_info_check_input.id = "mypage_info_check";
    mypage_info_check_input.setAttribute("type", "password");
    mypage_info_check_input.setAttribute("placeholder", "비밀번호 입력란");

    let mypage_info_submit = document.createElement("button");
    mypage_info_submit.id = "mypage_info_submit";
    mypage_info_submit.setAttribute("type", "button");
    mypage_info_submit.classList.add("button", "large_button");
    mypage_info_submit.innerHTML = "입력"

    const article_container = document.querySelector(".article_content");
    article_container.innerHTML = "";

    article_container.appendChild(mypage_info_check);
    article_container.appendChild(mypage_info_check_input);
    article_container.appendChild(mypage_info_submit);

    mypage_info_submit.addEventListener('click', () => {
        import('./cookie.js').then((obj) => {
            const cookie_id = obj.getCookie("user_id");
            if(cookie_id !== null){
                const inputPassword = document.querySelector("#mypage_info_check").value;
                import('./auth.js').then(async(obj) => {
                    const result = await obj.checkIDandpassword(cookie_id, inputPassword);
                    if(result === true){
                        add_password_change_form();
                    } else {
                        import('./custom_alert.js').then(obj => {
                            obj.customAlert("비밀번호가 잘못되었습니다.", null);
                        });
                    }
                });
            }
        });
    });
    document.querySelector("#popup_dim").remove();
});

email_input.addEventListener('change', () => {
    import('./auth.js').then((obj) => {
        const result_txt = document.querySelector("p.check_result[name=email]");
        const check_result = obj.checkEmailRegex(email_input.value);
        if(!check_result){
            result_txt.style.color = "#810000";
            result_txt.textContent = "이메일 형식에 맞지 않습니다.";
        } else {
            result_txt.textContent = "";
        }
    });
});

email_change_button.addEventListener('click', () => {
    import('./auth.js').then((obj) => {
        const result_txt = document.querySelector("p.check_result[name=email]");
        const email_cur = document.querySelector("#email_cur").getAttribute("placeholder");
        const check_result = obj.checkEmailRegex(email_input.value);
        if(!check_result){
            result_txt.style.color = "#810000";
            result_txt.textContent = "이메일 형식에 맞지 않습니다.";
        } else {
            import('./cookie.js').then(async(obj) => {
                const cookie_id = obj.getCookie("user_id");
                fetch('/edit-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({
                        user_id: cookie_id,
                        email_cur: email_cur,
                        email_change: email_input.value,
                    })
                }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if(data.message == "SUCCESS"){
                        window.alert("이메일이 변경되었습니다.");
                        window.location.href = data.redirect_url;
                    } else {
                        window.alert("오류가 발생했습니다.", data.message);
                        window.location.href = data.redirect_url;
                    }
                });
            });
        }
    });
});