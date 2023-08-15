function writeContent(){
    const write_type = window.location.href.split(/[\/|?]/)[3];
    const write_url = '/' + write_type + '/write';
    import('./auth.js').then(async obj => {
        const result = await obj.auth();
        if(result === true){
            window.location.href = write_url;
        }
    });
}

function updateContent(){
    import('./auth.js').then(async (obj) => {
        const result = await obj.auth();
        if(result === true){
            let update_url = new URL(window.location.href);
            update_url.searchParams.append("method", "update");
            window.location.href = update_url.toString();
        }
    });
}

function deleteContent(){
    import('./auth.js').then(async (obj) => {
        const result = await obj.auth();
        if(result === true){
            let delete_url = new URL(window.location.href);
            delete_url.searchParams.append("method", "delete");
            import('./custom_alert.js').then(async obj => {
                obj.customOKCancel("삭제하시겠습니까?", null, delete_url.toString());
            });
        }
    });
}