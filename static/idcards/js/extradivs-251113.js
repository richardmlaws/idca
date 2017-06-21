$(document).ready(function() {

//var pid = $('span.pid').text();
//var prodname = $('#product h1').text().replace( /\s+/g, "-" );
//var prodimg = $('#product .image img').attr('src');
//var produrl = window.location.pathname;
//$('#product .main-wrap').append ($("<div class='product-reviews'>Product Reviews</div><div data-bread-crumbs='id cards' data-name="+prodname+" data-product-id="+pid+" data-image-url="+prodimg+" data-url="+produrl+" data-domain='www.idcardsandaccessories.co.uk' data-appkey='kmCpb81DEidT6b9Xp54HJiGeQCLoc6WrAuQwUExC' class='yotpo reviews'></div>"));

$('.price, tr.price-row td, strong#unit-price, td.tar.pr').each(function() {
    var $this = $(this);
    var text = $this.text();
    text = text.replace(/(\.\d\d)00$/, '$1');
    $this.text(text);
});

$('#featured').prepend ("<div class='best-sellers-title'><p>Best Selling Items</p></div>");
$('#product-list .inner-box').prepend ("<div id='prod-view'><img src='/static/idcards/css/select-product-view.gif'><ul class='product-view'><li class='listview'><img width='30' height='30' src='/static/listview.jpg' /></li><li class='gridview'><img width='30' height='31' src='/static/gridview.jpg' /></li></ul></div>");

$('input:checkbox, input[type=radio]').change(function(){
    if($(this).is(":checked")) {
		update();
    }
    else {
        update();
    }
});

$("input[type=checkbox], input[type=radio]").live("click",function(){
		var $decbox = $(this).parents(".dec-box");
		$("li",$decbox).removeClass("selected").find("fieldset").hide();
		$(".radios .text",$decbox).hide();
		$("input[type=checkbox]:checked, input[type=radio]:checked",$decbox).each(function(){
			$(this).parent().parent().addClass("selected").find(">fieldset").show();
			if ( $(this).parent().parent().hasClass("custom") ) {
				$(this).parent().parent().find(".text").fadeIn("slow").focus();
			}
		});
		// update prices
		update();
});

//$("<button id='add-new-dec' type='button'>Click Here to Add Option(s)</button>").insertBefore('#.lanyards #product #decorations');
//$("#add-new-dec").click(function(){
		//$( '.lanyards #product #decorations' ).slideDown("slow");
		//$( '#add-new-dec' ).hide ();
//});

var el = $(".product-view li.listview");
$(el).click(function(){
	el.each(function(){
	  $(".product-list ol li").removeClass("gridview");            
	}); 
   $(".product-list ol li").addClass("listview");                             
});

var el = $(".product-view li.gridview");
$(el).click(function(){
	el.each(function(){
	  $(".product-list ol li").removeClass("listview");            
	}); 
   $(".product-list ol li").addClass("gridview");                             
});

$("<div id='top-phone'><a href='tel:02920708702'>02920 708702</div>").insertBefore('#top-links');
$("<div id='top-email'><a href='mailto:sales@idcardsandaccessories.co.uk'>sales@idcardsandaccessories.co.uk</a></div>").insertAfter('#top-phone');
$('#header .inner-content').append ($('#menu'));
$('#top-search input#keywords').attr({
	value: "Enter Keywords/Phrase"
});
$('#top-search input#keywords').click(function() {  $(this).val("") });
$('#catadvert').insertBefore('#category-nav');

if($('.success').length >0 ){
   $( '#product .discounts' ).css( "margin-top", "40px" );
   $( '#product .item-info' ).css( "top", "145px" );   
}
if($('.multi-images').length >0 ){
   $( '#product .basket' ).css( "margin-top", "-275px" );  
}

$('#customer-reviews').insertAfter('#product .basket');

$("select#pay-type option[value='PayPalSubscription']").remove();

//$('.discounts').insertBefore('.info-wrap');
//$('.item-info').insertAfter('.discounts');

//$('#slider1').anythingSlider({
//	theme : 'minimalist-square',
//	easing : 'linear',
//	autoPlay : true,
//	hashTags : false
//});

//facebook popout on test page
//$(".w2bslikebox").hover(function() {$(this).stop().animate({right: "0"}, "medium");}, function() {$(this).stop().animate({right: "-250"}, "medium");}, 500);
//twitter popout on test page
//$(".w2bstwitterbox").hover(function() {$(this).stop().animate({right: "0"}, "medium");}, function() {$(this).stop().animate({right: "-250"}, "medium");}, 500);
//feedburner popout on test page
//$(".w2bsblogbox").hover(function() {$(this).stop().animate({right: "0"}, "medium");}, function() {$(this).stop().animate({right: "-250"}, "medium");}, 500);

//jQuery('.related').append('<div class="carousel-buttons"><a href="#" class="carousel-button button-left"><img class="prev" alt="" src="/static/idcards/css/arrow-left.png" /></a> <a href="#" class="carousel-button button-right"><img class="next" alt="" src="/static/idcards/css/arrow-right.png" /></a></div>');

//$(".related").jCarouselLite({
//	btnNext: ".next",
//	btnPrev: ".prev",
//	visible: 5,
//	easing: "bounceout",
//	auto: 3600,
//	speed: 1000,
//	scroll: 1
//});

});
