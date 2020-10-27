
//var allLinks = "<%--<%=ViewState["AllLink"].ToString()%>--%>";

$.ajaxSetup({
    type: 'POST',
    headers: { "cache-control": "no-cache" }
});
$(document).ready(function () {
    if (user_flag == '0') {
        $('.half--first').attr('href', '../UI/BR');
        $('.half--second').attr('href', '../UI/BR');
    } else if(user_flag == '1'){
        $('.half--first').attr('href', '../UI/HO');
        $('.half--second').attr('href', '../UI/HO');
    }
    else {
        $('.half--first').attr('href', '../UI/ALL');
        $('.half--second').attr('href', '../UI/ALL');
    }


    LoadAllLink();
    $('.multiple-items').empty();
    $('.multiple-items').append(favLinks);
    FavSlick();

    $('.recent-items').empty();
    $('.recent-items').append(recentLinks);
    RecentSlick();

    $('.closeBtn').click(function (e) {

        $(this).closest('.type-1').hide("slow", function () { $(this).closest('.type-1').remove(); })
        let linkId = $(this).closest('.type-1').find('.linkId').html();
        //alert(linkId);
        let url = "../Service/LinkService.asmx/UpdateFavLink";
        SetUpdateFavLink(linkId, ipAddress, url)
    });
    $(".type-1").hover(function () {
        $(this).find(".closeBtn").show(400);
        $(this).find(".recentTime").show(400);
    }, function () {
        $(this).find(".closeBtn").hide(400); /* Hides the .vote button on hover */
        $(this).find(".recentTime").hide(400); /* Hides the .vote button on hover */

    });



});

function FavSlick() {
    $('.multiple-items').slick({
        dots: false,
        infinite: false,
        arrows: true,
        autoplay: false,
        speed: 500,
        draggable: true,
        slidesToShow: 4,
        slidesToScroll: 3,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: false,
                    draggable: true,
                    arrows: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    draggable: true,
                    arrows: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    draggable: true,
                    arrows: false
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
}

function RecentSlick() {
    $('.recent-items').slick({
        dots: false,
        infinite: false,
        arrows: true,
        autoplay: false,
        speed: 500,
        draggable: true,
        slidesToShow: 4,
        slidesToScroll: 3,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: false,
                    draggable: true,
                    arrows: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    draggable: true,
                    arrows: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    draggable: true,
                    arrows: false
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
}
function AjaxPostRequest(url, parameters, successCallback) {
    //show loading... image

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(parameters),
        contentType: 'application/json;',
        dataType: 'json',
        //beforeSend: function () {

        //            $('#loadingModal').modal('show');

        //    },
        //    complete: function () {
        //        $('#loadingModal').modal('hide');

        //},
        success: successCallback,
        error: function (err) {
            alert("Failed to Load Data");
            //console.log(err);
        }
    });
};

function LoadAllLink() {

    var url = "../Service/LinkService.asmx/GetAllLinkByUser";
    var parameter = {
        userFlag: user_flag,
        ipAdddress: ipAddress

    };
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d);
        if (jsonData.length != 0) {

            SetCardCategory(jsonData);
        } else { }
    });
};
function LoadAllFavLink() {

    var url = "../Service/LinkService.asmx/GetFavLink";
    var parameter = {
        pip_address: ipAddress

    };
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d);
        let favLinks = '';
        let i = 1;
        if (jsonData.length != 0) {
            for (k = 0; k < jsonData.length; k++) {
                favLinks += "<div  class='type-1' id='fav-item-" + jsonData[k].LINK_ID + "'>" +
                    "<span class='btn btn-dark closeBtn' style='left: 17px; border-radius: 50px; z-index:4; display: none; '>X</span>" +
                    "<span class='linkId' style='display:none;'>" + jsonData[k].LINK_ID + "</span>" +
                    "<a href='" + jsonData[k].LINK_URL + "' target='_blank' class='btn btn-" + i + " anchor'>" +
                    "<span class='txt favSpan'>" + jsonData[k].LINK_TITLE + "</span>" +
                    "<span class='round favSpan'><i class='fa fa-chevron-right'></i></span>" +
                    "</a></div>";

                i++;
                if (i > 4)
                    i = 1;
            }
            $('.multiple-items').slick('unslick');
            $('.multiple-items').empty();


            $('.multiple-items').append(favLinks);
            FavSlick();

            $(".type-1").hover(function () {
                $(this).find(".closeBtn").show(400);
            }, function () {
                $(this).find(".closeBtn").hide(400); /* Hides the .vote button on hover */

            });
            $('.closeBtn').click(function (e) {

                $(this).closest('.type-1').hide("slow", function () { $(this).closest('.type-1').remove(); })
                let linkId = $(this).closest('.type-1').find('.linkId').html();
                //alert(linkId);
                let url = "../Service/LinkService.asmx/UpdateFavLink";
                SetUpdateFavLink(linkId, ipAddress, url);
            });

        } else {
            $('.multiple-items').empty();
        }
    });
};
function LoadAllRecentLink() {

    var url = "../Service/LinkService.asmx/GetLinkLog";
    var parameter = {
        pip_address: ipAddress

    };
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d);
        console.log(jsonData);
        let recentLinks = '';
        let i = 5;
        if (jsonData.length != 0) {
            for (k = 0; k < jsonData.length; k++) {
                recentLinks += "<div  class='type-1'>" +
                    "<span class='btn btn-dark recentTime' style='left: 17px; border-radius: 50px; z-index:4; display: none; '>" + jsonData[k].TIME_INTERVAL + "</span>" +
                    "<span class='linkId' style='display:none;'>" + jsonData[k].LINK_ID + "</span>" +
                    "<a href='" + jsonData[k].LINK_URL + "' target='_blank' class='btn btn-" + i + " anchor'>" +
                    "<span class='txt favSpan'>" + jsonData[k].LINK_TITLE + "</span>" +
                    "<span class='round favSpan'><i class='fa fa-chevron-right'></i></span>" +
                    "</a></div>";

                i++;
                if (i > 8)
                    i = 5;
            }
            $('.recent-items').slick('unslick');
            $('.recent-items').empty();


            $('.recent-items').append(recentLinks);
            RecentSlick();

            $(".type-1").hover(function () {
                $(this).find(".recentTime").show(400);
            }, function () {
                $(this).find(".recentTime").hide(400); /* Hides the .vote button on hover */

            });

        } else {
            $('.recent-items').empty();
        }
    });
};

function SetCardCategory(jsonData) {
    //console.log(jsonData);
    var categories = [];
    var linkCategory = {};

    for (i = 0; i < jsonData.length; i++) {
        if (categories.map(obj => obj.CATG_ID).indexOf(jsonData[i].CATG_ID) === -1) {

            linkCategory.CATG_ID = jsonData[i].CATG_ID;
            linkCategory.CATG_NAME = jsonData[i].CATG_NAME;
            categories.push(linkCategory);
            linkCategory = {};

        }
    }


    //console.log(categories);
    var cardColor = ['Gradient-crimson', 'yellowgreen', 'Gradient-mantle', 'Gradient-blue', 'Gradient-green', 'Amber', 'Gradient-petrichor'];//'Indigo',
    //var cardColor = ['crimson','kyoto'];
    let cardBackground = ['#FFCDD2', '#F3E5F5', '#FCE4EC', '#E8EAF6', '#E3F2FD', '#E0F7FA', '#E0F2F1', '#E8F5E9', '#FFF8E1', '#FBE9E7'];//'Pink','Red', 'Purple',
    let cardSinglecolor = 'Grey';
    let cardBackSinglecolor = 'white';
    let fadeAnimation = ['fadeInLeft', 'fadeInRight', 'fadeInUp', 'fadeInDown'];
    var cardLinksHtml = '';
    let k = 0;
    let f = 0;
    let c = 0;
    let linkJsonData;
    for (var i = 0; i < categories.length; i++) {
        if (c % 3 == 0) {
            cardLinksHtml += '<div class="row">';
        }

        //k = getRandomArbitrary(0, 10);
        f = getRandomArbitrary(0, 3);
        //console.log(k);
        cardLinksHtml += '<div class="col-md-4  animated ' + fadeAnimation[f] + '" style="animation-duration: 1s">' +
            '<section class="panel panel-default " style="border-radius:30px; background-color:' + cardBackSinglecolor + ';">' +
            '<header class="panel-heading lt no-border ">' +
            '<div class="clearfix"><div class="clear">' +
            '<article class="material-card ' + cardSinglecolor + ' mc-active  shadow">' +
            '<h2><strong><i class="fa fa-fw fa-star"></i> ';
        cardLinksHtml += categories[i].CATG_NAME;
        cardLinksHtml += '</strong> </h2 ></article > </div > </div > </header > <div class="panel-body ">';
        linkJsonData = jsonData.filter(element => element.CATG_ID == categories[i].CATG_ID);
        let r = 0;
        let favIconClass = 'fa-heart';
        let tooltipTitle = 'Remove from Favourites';
        for (var j = 0; j < linkJsonData.length; j++) {
            favIconClass = 'fa-heart';
            let isFav = 1;
            isFav = linkJsonData[j].IS_FAV;
            if (isFav == 0) {
                favIconClass = 'fa-plus';
                tooltipTitle = 'Add to Favourites';

            }
            f = getRandomArbitrary(0, 3);
            if (r % 2 == 0) {
                cardLinksHtml += '<div class="row">';
            }
            let linkImageUrl = '' + linkJsonData[j].LINK_IMG_URL;
            linkImageUrl = '../LinkImage/'+linkImageUrl.substring(linkImageUrl.lastIndexOf('\\')+1);
            cardLinksHtml += '<div class="col-md-6  animated ' + fadeAnimation[f] + '"  style = "animation-duration: 2s" >' +
                '<div class="card LinksCard">' +
                '<div class="card-img" style="background-image: url(' + linkImageUrl +');background-size: contain;">' +
                '<div class="overlay">' +
                '<div class="overlay-content">' +
                '<div class="row" style="margin-right: 0px; margin-left: 0px; height:40px; margin-top:-15px">' +
                '<a style="border-radius: 0px 0px 10px 10px;background-color:red; border:none; delay:0" href="#" data-toggle="tooltip" title="' + tooltipTitle + '" class="favLinkButton" >' +
                '<p hidden class="linkId">' + linkJsonData[j].LINK_ID + '</p><i class="fa ' + favIconClass + '"></i></a > ' +
                '</div>' +
                '<div class="row" style="margin-right: 0px; margin-left: 0px; height:60px;margin-top:15px">' +
                '<a  style="" class="hover link_url linkClick" href="' + linkJsonData[j].LINK_URL + '" target="_blank">View</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<a  class="linkClick" style="text-decoration:none; display: block;color: #202927;" href="' + linkJsonData[j].LINK_URL + '"  target="_blank">' +
                '<div class="card-content ' + cardColor[k] + '" >' +
                '<h2>' + linkJsonData[j].LINK_TITLE + '</h2>' +
                '</div>' +
                '</a>' +
                '</div>' +
                '</div>';
            r += 1;
            if (r % 2 == 0) {
                cardLinksHtml += '</div>';
            }
        }
        cardLinksHtml += '</div></section ></div>';

        k += 1;
        if (k >= cardColor.length) {
            k = 0;
        }

        c += 1;
        if (i > 0 && i < categories.length - 1) {

            let previousRowLength = Math.round(jsonData.filter(element => element.CATG_ID == categories[i - 1].CATG_ID).length / 2);

            let nextRowLength = Math.round(jsonData.filter(element => element.CATG_ID == categories[i + 1].CATG_ID).length / 2);
            let currentRowLength = Math.round(linkJsonData.length / 2);

            //console.log(previousRowLength);
            //console.log(currentRowLength);
            //console.log(nextRowLength);
            if ((previousRowLength - currentRowLength) >= nextRowLength) {
                c -= 1;
            }

        }

        if (c % 3 == 0) {

            cardLinksHtml += '</div>';

        }
    }


    $('#categoryDiv').empty();
    $('#categoryDiv').append(cardLinksHtml);
    //$('#categoryDiv').append(allLinks);  
    let mydeg = 0;
    let m = 1;
    $('.favLinkButton').on("click", function () {
        var linkId = $(this).find('.linkId').html();
        //var ipAddress = ipAddress;

        mydeg += 360;
        if ($(this).find("i").hasClass("fa-plus")) {
            let url = "../Service/LinkService.asmx/SetFavLink";
            console.log(ipAddress);

            SetUpdateFavLink(linkId, ipAddress, url);
            //LoadAllFavLink();
            $(this).animate(
                { deg: mydeg },
                {
                    duration: 800,
                    step: function (now) {
                        $(this).css({ transform: 'rotate(' + now + 'deg)' });
                    }
                }
            );

            $(this).find("i").toggleClass("fa-plus fa-heart");
            $(this).attr('title', 'Remove from Favourites');
            $(this).attr('data-original-title', 'Remove from Favourites');

            let linkUrl = $(this).closest('.card').children('a').attr('href');
            let linkTitle = $(this).closest('.card').find('h2').html();

            m += 1;
            if (m > 4)
                m = 1;
            let favLinks = "<div  class='type-1' id='fav-item-" + linkId + "'>" +
                "<span class='btn btn-dark closeBtn' style='left: 17px; border-radius: 50px; z-index:4; display: none; '>X</span>" +
                "<span class='linkId' style='display:none;'>" + linkId + "</span>" +
                "<a href='" + linkUrl + "' target='_blank' class='btn btn-" + m + " anchor'>" +
                "<span class='txt favSpan'>" + linkTitle + "</span>" +
                "<span class='round favSpan'><i class='fa fa-chevron-right'></i></span>" +
                "</a></div>";
            //alert(linkUrl);
            $('.multiple-items').slick('slickAdd', favLinks);
            $(".type-1").hover(function () {
                $(this).find(".closeBtn").show(400);
            }, function () {
                $(this).find(".closeBtn").hide(400); /* Hides the .vote button on hover */

            });
            $('.closeBtn').click(function (e) {

                $(this).closest('.type-1').hide("slow", function () { $(this).closest('.type-1').remove(); })
                let linkId = $(this).closest('.type-1').find('.linkId').html();
                //alert(linkId);
                let url = "../Service/LinkService.asmx/UpdateFavLink";
                SetUpdateFavLink(linkId, ipAddress, url);
            });

        }
        else {
            let url = "../Service/LinkService.asmx/UpdateFavLink";
            SetUpdateFavLink(linkId, ipAddress, url);
            //LoadAllFavLink();
            $(this).animate(
                { deg: mydeg },
                {
                    duration: 800,
                    step: function (now) {
                        $(this).css({ transform: 'rotate(' + now + 'deg)' });
                    }
                }
            );

            // alert('link removed from favourite');
            $(this).find("i").toggleClass("fa-plus fa-heart");
            $(this).attr('title', 'Add to Favourites');
            $(this).attr('data-original-title', 'Add to Favourites');
            let favid = '#fav-item-' + linkId;
            $(favid).hide('slow', function () { $(favid).remove(); });;
            //$(favid).remove('slow');
            //let removedSlick = $(favid).attr('data-slick-index');
            //alert(linkId + ' '+ ' ' +removedSlick);
            //$('.multiple-items').slick('slickRemove', removedSlick);

        }

    })

    //$('.linkClick').click(function (e) {
    //    var linkId = $(this).closest('.card').find('.linkId').html();
    //    SetUpdateLinkLog(linkId, ipAddress);
    //    LoadAllRecentLink();


    //});

    $(".LinksCard").hover(function () {
        $(this).css('cursor', 'pointer');
    }, function () {
        //$(this). /* Hides the .vote button on hover */

    }); 
    $('.LinksCard:not(.favLinkButton)').click(function (e) {
        e.preventDefault();
        $('.favLinkButton').on("click", function () {
            
            return false;
        });
        var linkId = $(this).find('.linkId').html();
        SetUpdateLinkLog(linkId, ipAddress);
        LoadAllRecentLink();

        var linkurl = $(this).find('.link_url').attr('href');
        var win = window.open(linkurl, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }
        //alert(linkurl);


    });

    $('.type-1').click(function (e) {
        $('.closeBtn').on("click", function () {
            return false;
        });
        var linkId = $(this).find('.linkId').html();
        SetUpdateLinkLog(linkId, ipAddress);
        LoadAllRecentLink();
        //location.reload();


    });

};
function SetUpdateLinkLog(linkId, pip_address) {
    let url = "../Service/LinkService.asmx/SetLinkLog";
    var parameter = {
        pip_address: pip_address,
        plink_id: linkId
    };
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d);
        //if (jsonData == 'null')
        //    alert('error');


    });
}
function SetUpdateFavLink(linkId, pip_address, url) {
   
    var parameter = {
        pip_address: pip_address,
        //pip_address: '192.168.104.45',
        plink_id: linkId
    };
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d);
        if (jsonData != 'null')
            alert(jsonData);


    });
}
function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};