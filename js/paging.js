function paging(curPage){
    $(".cur").removeClass("cur");
    $(".view").eq(curPage-1).addClass("cur");
}

function prev_page(){
    var curPage = Number($(".cur").attr("value"));
    if(curPage > 1){
        paging(curPage - 1);
    }
}

function next_page(){
    var curPage = Number($(".cur").attr("value"));
    if(curPage < 5){
        paging(curPage + 1);
    }
}