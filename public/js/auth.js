export async function auth(){
    let is_succeed = false;
    await fetch('/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type':'application/json',
        },
    }).then((response) => response.json())
    .then((data) => {
        if(data.message == "Timeout"){
            import('./custom_alert.js').then(obj => {
                obj.customAlert("로그인이 필요합니다.", null, '/login');
            });
            localStorage.removeItem('token');
        }
        else if(data.message == "Success"){
            is_succeed =  true;
        }
        else if(data.message == "New Access Token"){
            localStorage.setItem('token', data.token);
            is_succeed = true;
        }
    });
    return is_succeed;
};

export async function checkIDandpassword(user_id, password){
    let is_succeed = false;
    await fetch('/api/checkuser', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: user_id,
            password: password,
        })
    }).then((response) => response.json())
    .then((data) => {
        if(data.message == "Success"){
            is_succeed =  true;
        } else if(data.message == "User Not Found" || data.message == "Invalid Password"){
            is_succeed = false;
        } else if(data.message == "something went wrong") {
            is_succeed = false;
            window.location.href = data.redirect_url;
        }
    });

    return is_succeed;
}

export async function checkIDExist(id_txt){
    const id_regex = /^[a-zA-Z0-9]{6,}$/;
    let is_exist = false;

    if(id_regex.test(id_txt)){
        fetch('/check-id', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: id_txt
            })
        })
        .then((response) => response.json())
        .then((data) => { 
            is_exist = data.is_exist;
        })
        .catch((err) => console.log(err));
    } 

    return is_exist;
}

export async function checkPassword(password_txt){
    let is_exist = false;

    await import('./cookie.js').then(async(obj) => {
        const cookie_id = obj.getCookie("user_id");
        await fetch('/check-password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: cookie_id,
                password: password_txt,
            })
        })
        .then((response) => response.json())
        .then((data) => { 
            if(data.is_exist == true){
                is_exist = true;
            } else {
                if(data.redirect_url !== undefined){
                    let alert_message = "";
                    if(data.redirect_url === '/login'){
                        alert_message = "로그인이 필요합니다.";
                    } else if(data.redirect_url === '/'){
                        alert_message = "오류가 발생했습니다. 홈으로 돌아갑니다.";
                    }
                    import('./custom_alert.js').then(obj => {
                        obj.customAlert(alert_message, null, data.redirect_url);
                    });
                } 
            }
        })
        .catch((err) => console.log(err));
    });

    return is_exist;
}

export function checkPasswordRegex(password_txt){
    const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^*+=-]{8,}/;
    return password_regex.test(password_txt);
}

export function checkEmailRegex(email){
    const email_regex = /^[^0-9](?=.*[a-zA-Z0-9_+.-]).+@([a-z]+\.)+[a-z0-9]+$/;
    return email_regex.test(email);
}
