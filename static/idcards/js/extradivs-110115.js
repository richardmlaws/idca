$(document).ready(function() {

$('head').append('<meta name="viewport" content="width=device-width" />');
$('#tertiary').insertBefore('#primary');
$('#top-header').insertBefore('#header');
$('<div id="topphone">02920 708702</div>').insertAfter ($('#header h2'));
$('<div id="topemail"><a href="mailto:sales@idcardsandaccessories.co.uk">sales@idcardsandaccessories.co.uk</div>').insertAfter ($('#topphone'));
$('#secondary').insertAfter('#header h2');
$('.mini-basket').insertAfter('#top-search');
//$('#header .inner-content').append ($('#menu'));
$('#tertiary .inner-content').append ($('nav#nav-products'));
$('#nav-trigger-products').insertAfter('nav#nav-products');
$('#nav-mobile-products').insertAfter('#nav-trigger-products');
//$('#top-header li ul').append ($('#secondary #login'));

$('.price, tr.price-row td, strong#unit-price, td.tar.pr').each(function() {
    var $this = $(this);
    var text = $this.text();
    text = text.replace(/(\.\d\d)00$/, '$1');
    $this.text(text);
});

$( "#product .basket label.filter, #product .basket table, #product .basket .vpress-init" ).wrapAll( "<div class='leftbasket' />" );
$('#submits').prepend ("<p class='delvat'>**Delivery & VAT will display in your basket if applicable</p>");
$("select#pay-type option[value='PayPalSubscription']").remove();

if ($('a.vpress-init').length >0 ){ 
    $(' #product .basket input#add-to-basket' ).css( "display", "none" ); 
}

var el = $("a.vpress-init");
$(el).click(function(){
	el.each(function(){
	  $(' #product .basket input#add-to-basket' ).css( "display", "block" );           
	});                             
});

//$('#top-search input#keywords').attr({
//	value: "What are you looking for?"
//});
//$('#top-search input#keywords').attr({
//	value: "What are you looking for?"
//}); 
//	var default_val = '';
//   $('#top-search input#keywords').focus(function() {
//       if($(this).val() == $(this).data('default_val') || !$(this).data('default_val')) {
//            $(this).data('default_val', $(this).val());
//            $(this).val('');
//       }
//    });
//	$('#top-search input#keywords').blur(function() {
//        if ($(this).val() == '') $(this).val($(this).data('default_val'));
//    });

$("#nav-mobile").html($("#nav-main").html());
$("#nav-trigger span").click(function(){
	if ($("nav#nav-mobile ul").hasClass("expanded")) {
		$("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
		$(this).removeClass("open");
	} else {
		$("nav#nav-mobile ul").addClass("expanded").slideDown(250);
		$(this).addClass("open");
	}
}); 

$("#nav-mobile-products").html($("#nav-products").html());
$("#nav-trigger-products span").click(function(){
	if ($("nav#nav-mobile-products ul").hasClass("expanded")) {
		$("nav#nav-mobile-products ul.expanded").removeClass("expanded").slideUp(250);
		$(this).removeClass("open");
	} else {
		$("nav#nav-mobile-products ul").addClass("expanded").slideDown(250);
		$(this).addClass("open");
	}
});

$("#product fieldset.step2").addClass("dec-opts");

$('input:checkbox, input[type=radio]').change(function(){
    if($(this).is(":checked")) {
		update();
    }
    else {
        update();
    }
});

$("input[type=checkbox], input[type=radio]").live("click",function(){
		var $decbox = $(this).parents("#decorations");
		$("li",$decbox).removeClass("selected").find("fieldset").hide();
		$(".radios .text",$decbox).hide();
		$("input[type=checkbox]:checked, input[type=radio]:checked",$decbox).each(function(){
			$(this).parent().parent().addClass("selected").find(">fieldset").show();
			//if ( $(this).parent().parent().hasClass("custom") ) {
				//$(this).parent().parent().find(".text").fadeIn("slow").focus();
			//}
		});
		// update prices
		update();
});

$('#home-cat-icons').insertAfter('#featured');
$('#home-info').insertAfter('#home-cat-icons');

$('#product .discounts').insertBefore('.pdv-body');
$('#product .body').insertAfter('#product .basket');

//$('#product .multi-images').insertAfter('#product .basket');
//$('#product .basket').append ($('<div id="upload-artwork"><img alt="" src="/static/gifts/upload-artwork.gif" style="width: 250px; height: 74px;" /></div>'));
//$('#basket fieldset.additional li.textarea').append ($('<div id="upload-artwork-basket"><img alt="" src="/static/gifts/upload-artwork-basket.gif" style="width: 250px; height: 74px;" /></div>'));
//$('.multi-images').insertAfter('#product .image');

$(".ui-tabs").tabs();
$('#tabs-1').append ($('.body.product'));
//$('#tabs-2').append ($('#product .item-info'));
//$('#tabs-3').append ($('div.pdv-mini-enquiry-form'));
//$('#tabs-5').append ($('#customer-reviews'));

//$('<div class="od-field01"><input type="hidden" name="basket:_new:d1_position&basket:_new0:d1_position&basket:_new1:d1_position&basket:_new2:d1_position&basket:_new3:d1_position&basket:_new4:d1_position&basket:_new5:d1_position&basket:_new6:d1_position&basket:_new7:d1_position&basket:_new8:d1_position&basket:_new9:d1_position&basket:_new10:d1_position&basket:_new11:d1_position&basket:_new12:d1_position&basket:_new13:d1_position&basket:_new14:d1_position&basket:_new15:d1_position&basket:_new16:d1_position&basket:_new17:d1_position&basket:_new18:d1_position&basket:_new19:d1_position&basket:_new20:d1_position&basket:_new21:d1_position&basket:_new22:d1_position&basket:_new23:d1_position&basket:_new24:d1_position&basket:_new25:d1_position&basket:_new26:d1_position&basket:_new27:d1_position&basket:_new28:d1_position&basket:_new29:d1_position&basket:_new30:d1_position&basket:_new31:d1_position&basket:_new32:d1_position&basket:_new33:d1_position&basket:_new34:d1_position&basket:_new35:d1_position&basket:_new36:d1_position&basket:_new37:d1_position&basket:_new38:d1_position&basket:_new39:d1_position&basket:_new40:d1_position&basket:_new41:d1_position&basket:_new42:d1_position&basket:_new43:d1_position&basket:_new44:d1_position&basket:_new45:d1_position&basket:_new46:d1_position&basket:_new47:d1_position&basket:_new48:d1_position&basket:_new49:d1_position&basket:_new50:d1_position" value="Extra Notes"/><span class="notes">Notes & Additional information</span><textarea rows="2" cols="26" id="d35_custom_text" name="basket:_new:d1_position&basket:_new0:d1_position&basket:_new1:d1_position&basket:_new2:d1_position&basket:_new3:d1_position&basket:_new4:d1_position&basket:_new5:d1_position&basket:_new6:d1_position&basket:_new7:d1_position&basket:_new8:d1_position&basket:_new9:d1_position&basket:_new10:d1_position&basket:_new11:d1_position&basket:_new12:d1_position&basket:_new13:d1_position&basket:_new14:d1_position&basket:_new15:d1_position&basket:_new16:d1_position&basket:_new17:d1_position&basket:_new18:d1_position&basket:_new19:d1_position&basket:_new20:d1_position&basket:_new21:d1_position&basket:_new22:d1_position&basket:_new23:d1_position&basket:_new24:d1_position&basket:_new25:d1_position&basket:_new26:d1_position&basket:_new27:d1_position&basket:_new28:d1_position&basket:_new29:d1_position&basket:_new30:d1_position&basket:_new31:d1_position&basket:_new32:d1_position&basket:_new33:d1_position&basket:_new34:d1_position&basket:_new35:d1_position&basket:_new36:d1_position&basket:_new37:d1_position&basket:_new38:d1_position&basket:_new39:d1_position&basket:_new40:d1_position&basket:_new41:d1_position&basket:_new42:d1_position&basket:_new43:d1_position&basket:_new44:d1_position&basket:_new45:d1_position&basket:_new46:d1_position&basket:_new47:d1_position&basket:_new48:d1_position&basket:_new49:d1_position&basket:_new50:d1_position"></textarea></div>').insertBefore($('#product .results'));
//$('#catadvert').insertBefore('#category-nav');

$('#featured .inner-box').jcarousel({
	wrap: 'circular'
});

$('.jcarousel-control-prev')
	.on('jcarouselcontrol:active', function() {
		$(this).removeClass('inactive');
	})
	.on('jcarouselcontrol:inactive', function() {
		$(this).addClass('inactive');
	})
	.jcarouselControl({
		target: '-=2'
	});

$('.jcarousel-control-next')
	.on('jcarouselcontrol:active', function() {
		$(this).removeClass('inactive');
	})
	.on('jcarouselcontrol:inactive', function() {
		$(this).addClass('inactive');
	})
	.jcarouselControl({
		target: '+=2'
	});

$('.jcarousel-pagination')
	.on('jcarouselpagination:active', 'a', function() {
		$(this).addClass('active');
	})
	.on('jcarouselpagination:inactive', 'a', function() {
		$(this).removeClass('active');
	})
	.jcarouselPagination();

	
	var carousel = $('#featured .inner-box');

    carousel.swipe({
        swipeLeft: function(event, direction, distance, duration, fingerCount) {   
            carousel.jcarousel('scroll', '+=2');
        },
        swipeRight: function(event, direction, distance, duration, fingerCount) {
            carousel.jcarousel('scroll', '-=2');
        }
    });

});