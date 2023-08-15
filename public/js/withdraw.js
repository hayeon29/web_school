const user_withdraw_btn = document.querySelector("button#user_withdraw");
user_withdraw_btn.addEventListener('click', () => {
    import('./custom_alert.js').then(async(obj) => {
        await obj.customOKCancel("정말 탈퇴하시겠습니까?", "탈퇴하기").then(data => {
            if(data === true){
                import('./cookie.js').then((obj) => {
                    const cookie_id = obj.getCookie("user_id");
                    fetch('/withdraw', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        redirect: 'follow',
                        body: JSON.stringify({
                            user_id: cookie_id,
                        }),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        if(data.redirect_url !== undefined) window.location.href = data.redirect_url;
                        else if (data.result_code === false) console.log("error occurred while deleting user, error name: ", data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                });
            }
        });
    })
});