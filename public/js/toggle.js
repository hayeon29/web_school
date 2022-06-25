$(document).ready(function(){
    $(".qna_content").hide();
});

function toggle(value){
    value *= 1
    $('.qna_content[value=\'' + value + '\']').slideToggle()
}


