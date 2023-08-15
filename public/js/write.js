const form = document.querySelector("form");
const submitBtn = document.querySelector("input[type='submit']");

form.addEventListener('submit', (event) => {
    event.preventDefault(); // 폼의 기본 동작을 막음

    const write_url = window.location.href.split((/[?,\/]/));
    let post_write_url = "";
    if(write_url[write_url.length - 1] == "write"){
        post_write_url = "content/post";
    } else {
        post_write_url = write_url[write_url.length - 2] + "/post";
    }

    const form_data = new FormData(form);
    const payload = new URLSearchParams(form_data);
    console.log("payload:: ", payload.toString());
    const urlParams = new URLSearchParams(write_url[write_url.length - 1]);
    payload.append("id", urlParams.get("id"));

    import('./auth.js').then(async (obj) => {
        const result = await obj.auth();
        if(result == true){
            fetch(post_write_url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: payload
            })
            .then((response) => response.json())
            .then((data) => {
                window.location.href = data.redirect_url;
            });
        }
    });
});
