$(document).ready(function(){
    $('.miswitch a').click(function(){
        $('.swicht-btn').toggleClass('on');

        if($('#swicht-btn').attr('class') == 'switcht-btn on'){
            $('.principing-table-cont').toggleClass('rotando-tabla');
        }
        else{
            $('.principing-table-cont').toggleClass('rotando-tabla');
        }
    });
});