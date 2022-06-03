function paging(page){
    var pageNum = Number(page);
    var curPage = $("a[value=" + pageNum + "]");
    $(".view").each((index, item) => {
        $(item).css('color', '#353535');
        $(item).css('font-weight', 'normal');
    })
    curPage.css('color', '#C12525');
    curPage.css('font-weight', 'bold');
}
