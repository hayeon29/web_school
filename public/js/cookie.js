export function getCookie(name){
    let result = null;
    let cookies = document.cookie.split(";");
    cookies.some((item) => {
        item = item.replace(' ', '');
        let dict = item.split("=");
        
        if(name === dict[0]) {
            result = dict[1];
            return true;
        }
    });

    return result;
}