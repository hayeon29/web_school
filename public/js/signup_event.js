const button = document.getElementById("chk_overlap")
const id_input = document.getElementById("id")
const signup_button = document.getElementById("signup")
const pass_chk = document.getElementById("password_chk")

button.addEventListener('click', function(e){
    
    const result_text = document.getElementsByName("check_result")[0]
    const id_text = id_input.value

    console.log("id: " + id_text)
    fetch('http://localhost:4000/check-id', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id_text
        })
    })
    .then((response) => response.json())
    .then((data) => { 
        const result = data.is_exist
        console.log("result: " + result)
        if(result == true){
            result_text.style.color = "#810000"
            result_text.innerHTML = "중복된 아이디입니다."
        } else {
            result_text.style.color = "#59DA50"
            result_text.innerHTML = "가입 가능한 아이디입니다."
        }
    })
    .catch((error) => console.log("error:", error));
})

id_input.addEventListener('change', function(e){
    const result_text = document.getElementsByName("check_result")[0]
    if(result_text.innerText != ""){
        result_text.innerText = ""
    }
})

pass_chk.addEventListener('change', function(e){
    const pass = document.getElementById("password").value
    const result_text = document.getElementsByName("check_result")[1]

    if(pass != pass_chk.value){
        result_text.style.color = "#810000"
        result_text.innerHTML = "일치하지 않습니다."
    } else {
        result_text.style.color = "#59DA50"
        result_text.innerHTML = "일치합니다."
    }
})

signup_button.addEventListener('click', function(e){
    const id_text = id_input.value
    const password = document.getElementById("password").value
    const email = document.getElementById("email").value

    fetch('http://localhost:4000/signup/result', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
            id: id_text,
            password: password,
            email: email
        })
    })
    .then((response) => {
        window.location.href = response.url
    })
    .catch((error) => console.log("error:", error));
})
