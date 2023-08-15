window.onload = () => {
    import('./auth.js').then(async(obj) => {
        const result = await obj.auth();
        if(result !== true){
            import('./custom_alert.js').then(async obj => {
                const alert_result = await obj.customAlert("로그인이 필요합니다.", null);
                if(alert_result){
                    window.location.href = "/login";
                }
            });    
        }
    });
}