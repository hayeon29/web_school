function paging(page){
    const page_num = Number(page);
    let curPage = document.querySelector("a[value=\'" + page_num + "\']");
    document.querySelectorAll(".view").forEach((item) => {
        item.style.color = '#353535';
        item.style.fontWeight = 'normal';
    });
    curPage.style.color = '#C12525';
    curPage.style.fontWeight = 'bold';
}
