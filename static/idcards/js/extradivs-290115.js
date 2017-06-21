$(document).ready(function() {

$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>');
$('#tertiary').insertBefore('#primary');
$('#top-header').insertBefore('#header');
$('<div id="topphone">029 2070 8702</div>').insertAfter ($('#header h2'));
$('<div id="topemail"><a href="mailto:sales@idcardsandaccessories.co.uk">sales@idcardsandaccessories.co.uk</div>').insertAfter ($('#topphone'));
$('#secondary').insertAfter('#header h2');
$('.mini-basket').insertAfter('#top-search');
$('#tertiary .inner-content').append ($('nav#nav-products'));
$('#nav-trigger-products').insertAfter('nav#nav-products');
$('#nav-mobile-products').insertAfter('#nav-trigger-products');
$('#secondary-featured').insertAfter('.box.basket');
$('#secondary-featured').prepend ("<p class='basketforgot'>Have you forgotten anything?</p>");

$('.price, tr.price-row td, strong#unit-price, td.tar.pr').each(function() {
    var $this = $(this);
    var text = $this.text();
    text = text.replace(/(\.\d\d)00$/, '$1');
    $this.text(text);
});

$( "#product .basket label.filter, #product .basket table, #product .basket .vpress-init" ).wrapAll( "<div class='leftbasket' />" );
$('.pdv-idcards-proofing .leftbasket').insertAfter('.pdv-idcards-proofing .multi-select');
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

$('#home-cat-icons4').insertAfter('#featured');
$('#home-info').insertAfter('#home-cat-icons4');
$('#product .discounts').insertBefore('.pdv-body');
$('#product .body').insertAfter('#product .basket');
$('#categoryadvert').insertAfter('.category #product-list');
$(".ui-tabs").tabs();
$('#tabs-1').append ($('.body.product'));

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
	
$("a[rel^='prettyPhoto']").prettyPhoto({
	default_width: 640,
	show_title: false,
	deeplinking: false
});

});