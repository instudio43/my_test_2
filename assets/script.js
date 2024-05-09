function appendCounter(){
  $('.wishlistcounter').appendTo('#bannertop-wishlist');
}
setTimeout(appendCounter, 4000);

$(document).ready(function(){
  $('.minibag').click(function(){
    $('.shifter').toggleClass('active_minibag');
  });
  /*footer*/
  var width = $(window).width();
  // alert(width);
  if (width <= 667)  {
    // SLiding codes
    $('#footer > h3').append('<span class="the-btn fa icon-angle-down"></span>');
    $('#footer  .desktop-3.tablet-half').hide();
    $('#footer > h3').click(function () {
      if (false == $(this).next().is(':visible')) {
        $('#footer  .desktop-3.tablet-half').hide();
      }
      var $currIcon=$(this).find("span.the-btn");
      $("#footer span.the-btn").not($currIcon).addClass('icon-angle-down').removeClass('icon-angle-up');
      $currIcon.toggleClass('icon-angle-up icon-angle-down');
      $(this).next().toggle();
      $("#footer > h3").removeClass("fotter_active");
      $(this).addClass('fotter_active');
    });
  };
  /*page*/
  $( "#page_banner" ).appendTo( "#image_banner" );
  /*
$('.reg-popup ').click(function(event) {
    event.preventDefault();

});*/
});

jQuery(document).ready(function(){
  jQuery('.reg-popup').on('click', function(){
    jQuery('#ztb-ecp-show-widget').trigger('click');
  });
});

jQuery(function() {
  jQuery('.swatch :radio').change(function() {
    var optionIndex = jQuery(this).closest('.swatch').attr('data-option-index');
    var optionValue = jQuery(this).val();
    jQuery(this)
    .closest('form')
    .find('.single-option-selector')
    .eq(optionIndex)
    .val(optionValue)
    .trigger('change');
  });
});

//Expand mobile submenu via return/enter key
// $(".shifter-handle").click(function(){
//   //var $nav = $(".shifter-navigation");
//   //$nav.find(".search input").focus();
// });
//Open mobile main menu via return/enter key
// $(".shifter-handle").keypress(function(event){
//   if(event.keyCode == 13){
//     $(this).click();
//   }
// });
//Toggle wishlist heart state, dynamically created element
$("body").delegate(".smartwishlist", "keydown", function(event){
  if(event.keyCode == 13){
    $(this).click();
  }
});
