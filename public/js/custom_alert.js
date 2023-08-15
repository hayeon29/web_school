export function customAlert(message, title){
    document.body.insertAdjacentHTML('afterbegin', '<div id="alert_frame" class = "vertical_frame"></div><div id="alert_box">'
        + '<div>'
            + '<div id="alert_head"></div>'
            + '<div id="alert_body"></div>'
            + '<div id="alert_foot"></div>'
        + '</div>'
    + '</div>');

    const alert_frame = document.getElementById('alert_frame');
    const alert_box = document.getElementById('alert_box');
    
    const win_height = window.innerHeight;

    alert_box.style.top = win_height / 2 - 100 + "px";

    alert_frame.style.display = "block";
    alert_box.style.display = "block";
    
    document.getElementById('alert_head').style.display = 'block';

    if(typeof title === 'undefined' || typeof title === 'null') {
        document.getElementById('alert_head').style.display = 'none';
    } else {
        document.getElementById('alert_head').innerHTML = title;
    }
    document.getElementById('alert_body').innerHTML = message;
    document.getElementById('alert_foot').innerHTML = '<button id = "alert_ok" class="active">OK</button>';
    const result = new Promise((resolve, reject) => {
        const alert_ok = document.querySelector("button#alert_ok");
        alert_ok.addEventListener('click', () => {
            document.getElementById('alert_box').remove();
            document.getElementById('alert_frame').remove();
            resolve(true);
        });
    }); 
    return result;
}

export function customOKCancel(message, title){
    customAlert(message, title);
    document.getElementById('alert_foot').innerHTML += '<button id = "alert_cancel" class="active">CANCEL</button>';
    const result = new Promise((resolve, reject) => {
        const alert_ok = document.querySelector("button#alert_ok");
        alert_ok.addEventListener('click', () => {
            document.getElementById('alert_box').remove();
            document.getElementById('alert_frame').remove();
            resolve(true);
        });

        const alert_cancel = document.querySelector("button#alert_cancel");
        alert_cancel.addEventListener('click', () => {
            document.getElementById('alert_box').remove();
            document.getElementById('alert_frame').remove();
            resolve(false);
        });
    }); 
    return result;
}