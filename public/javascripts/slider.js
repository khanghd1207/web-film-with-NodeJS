$(function () {
    $("#slider-range-year").slider({
        range: true,
        min: 1970,
        max: 2022,
        values: [$("#amount-year").attr('min') ? $("#amount-year").attr('min') : 0, $("#amount-year").attr('max') ? $("#amount-year").attr('max') : 0],
        slide: function (event, ui) {
            if (ui.values[0] != ui.values[1]) {
                $("#amount-year").val(ui.values[0] + " - " + ui.values[1]);
                $("#amount-year").attr('min', ui.values[0])
                $("#amount-year").attr('max', ui.values[1])
            }
        }
    });
    $("#amount-year").val($("#slider-range-year").slider("values", 0) +
        " - " + $("#slider-range-year").slider("values", 1));
    $("#slider-range-age").slider({
        range: true,
        min: 0,
        max: 18,
        values: [$("#amount-age").attr('min') ? $("#amount-age").attr('min') : 0, $("#amount-age").attr('max') ? $("#amount-age").attr('max') : 0],
        slide: function (event, ui) {
            if (ui.values[0] != ui.values[1]) {
                $("#amount-age").val(ui.values[0] + " - " + ui.values[1]);
                $("#amount-age").attr('min', ui.values[0])
                $("#amount-age").attr('max', ui.values[1])
            }
        }
    });
    $("#amount-age").val($("#slider-range-age").slider("values", 0) +
        " - " + $("#slider-range-age").slider("values", 1));
    $("#slider-range-rating").slider({
        range: true,
        min: 0,
        max: 10,
        step: 0.1,
        values: [$("#amount-rating").attr('min') ? $("#amount-rating").attr('min') : 0, $("#amount-rating").attr('max') ? $("#amount-rating").attr('max') : 0],
        slide: function (event, ui) {
            if (ui.values[0] != ui.values[1]) {
                $("#amount-rating").val(ui.values[0] + " - " + ui.values[1]);
                $("#amount-rating").attr('min', ui.values[0])
                $("#amount-rating").attr('max', ui.values[1])
            }
        }
    });
    $("#amount-rating").val($("#slider-range-rating").slider("values", 0) +
        " - " + $("#slider-range-rating").slider("values", 1));
});