function setup (argument) {


$(".traveler").each(function() {

    var random = (Math.random() * 8 + 2).toString() + 's';
    $(this).css({"-webkit-animation-duration": random});
    $(this).css("-webkit-animation-duration", random);
    $(this).css("animation-duration", random);
});

$(".bouncer").each(function() {
    var random = (Math.random() * 8 + 2).toString() + 's';
    $(this).css('-webkit-animation-duration', random);
    $(this).css('animation-duration', random);
    $(this).click(function () {
        $("#content div").hide();
        $("#content #" + $(this).attr('id')).show()
    });
});


}

