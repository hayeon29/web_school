const form = document.getElementById('form_login');

form.addEventListener('submit', async(event) => {
    event.preventDefault(); // 폼의 기본 동작을 막음

    const form_data = new FormData(form);
    const payload = new URLSearchParams(form_data);

    // 서버로 데이터를 전송하고 응답을 받아옴
    fetch('/login/result', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        localStorage.setItem('token', data.token);
        window.location.href = data.redirect_url;
        fetch('/api/token', {
            headers: {
                'Authorization': `Bearer ${data.token}`
            }
        });
    });
});
