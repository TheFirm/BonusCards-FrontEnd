
//for scrolable table http://jsfiddle.net/T9Bhm/7/

//http://n.bonuscards.relevant.software/v1/fetch

function loadCheckIns(cafeID){
    $.ajax({
        url: 'http://bonuscards.relevant.software/v1/list-check-ins?cafe_id='+cafeID,
        dataType: 'json',
        success: function (data){
            setCheckIns(data.data.items);
        }
    });
}

function setCheckIns(checkinsList){

    var tbodyCheckins = $('#checkinsList tbody');

    //clear checkins
    tbodyCheckins.html('');

    for (var checkin_key in checkinsList) {
        var checkin = checkinsList[checkin_key];
        // skip loop if the property is from prototype
        if (!checkinsList.hasOwnProperty(checkin_key)) continue;

        tbodyCheckins.append(generateCheckinsEl(checkin));
    }

}

function setCafes(json){
    for (var cafe_key in json.data) {
        var cafe = json.data[cafe_key];
        // skip loop if the property is from prototype
        if (!json.data.hasOwnProperty(cafe_key)) continue;


        var template = $('#cafeButtonTemplate').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var $cafe_el = $(Mustache.render(template, {}));

        $cafe_el.text(cafe.name);
        $cafe_el.attr('cafe-id',cafe.id);

        $cafe_el.click(selectCafe);

        $('#cafes').append($cafe_el);
    }
}



function loadCafes(){
    $.ajax({
        url: 'http://bonuscards.relevant.software/v1/cafes',
        dataType: 'json',
        success: setCafes
    });
}


function selectCafe(){
    var cafeID = $(this).attr('cafe-id');

    $('#cafeName').text($(this).text());

    showCafePage();

    loadCheckIns(cafeID);
}

function generateCheckinsEl(checkin_data){
    var checkin = {
        TableID: checkin_data['table_id'],
        Date: checkin_data['created_at'],
        FestCard: checkin_data['card_code'],
        Name: checkin_data['user']['name']
    };

    //var _tr = $('');


    var template = $('#checkInItemTemplate').html();
    Mustache.parse(template);   // optional, speeds up future uses
    var _tr = $(Mustache.render(template, {}));

    for (var checkin_p_key in checkin) {
        var checkin_p = checkin[checkin_p_key];
        // skip loop if the property is from prototype
        if (!checkin.hasOwnProperty(checkin_p_key)) continue;

        _tr.find('._' + checkin_p_key).text(checkin_p)
    }

    return _tr;
}

function addCheckinsToStartList(checkin){

    var tbodyCheckins = $('#checkinsList tbody');

    var checkin = {
        "cafe_id": 8,
        "table_id": 213,
        "card": {
            "id": 141,
            "name": "",
            "code": "4444444444455",
            "service": {
                "id": 1,
                "name": "!FEST",
                "logo_url": "http://bonuscards.relevant.software/images/fest_logo.png",
                "created_at": 1456487874,
                "updated_at": 1456487874
            }
        },
        "user": {
            "id": 15,
            "facebook_user_id": 1030522417028449,
            "name": "Vova Kravchuk",
            "created_at": 1461173537,
            "updated_at": 1461335067
        },
        "created_at": 1461187035
    };

    tbodyCheckins.prepend(generateCheckinsEl(checkin));
}


function showHomePage(){
    $('#homepage').show();
    $('#cafepage').hide();
}

function showCafePage(){
    $('#homepage').hide();
    $('#cafepage').show();
}

$( document ).ready(function() {
    loadCafes();
    $('#homePageLink').click(showHomePage);
});