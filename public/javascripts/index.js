// LOGIN
$(document).on('submit', '#loginUser', (err) => {
    let username = $('#username').val()
    let password = $('#password').val()
    // let remmeber = $('#customCheck').is(":checked")
    $.ajax({
        url: '/auth/local',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "X-CSRF-Token": $("#csrf").val(),
        },
        data: JSON.stringify({ displayName: username, password: password }),
        success: function (data) {
            showToast(new Toast("success", "toast-top-right", data.msg))
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        },
        error: function (data) {
            showToast(new Toast("error", "toast-top-right", data.responseJSON.err))
        }

    })
})
//login FB
$(document).on('click', '#loginFB', () => {
    window.location.href = '/auth-facebook'
})
//login GG
$(document).on('click', '#loginGG', () => {
    window.location.href = '/auth-google'
})
// REGISTER
$(document).on('submit', '#registerUser', (err) => {
    let username = $('#usernameRegister').val()
    let email = $('#emailRegister').val()
    let password1 = $('#pass1').val()
    let password2 = $('#pass2').val()
    if (password1 == password2) {
        $.ajax({
            url: '/register',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "X-CSRF-Token": $("#csrf").val(),
            },
            data: JSON.stringify({ username: username, email: email, password: password1 }),
            success: function (data) {
                showToast(new Toast("success", "toast-top-right", data.msg))
                setTimeout(() => {
                    window.location.href = '/login'
                }, 1000)
            },
            error: function (data) {
                showToast(new Toast("error", "toast-top-right", data.responseJSON.err))
            }

        })
    } else {
        showToast(new Toast("error", "toast-top-right", "Password not match!"))
    }
})

//FORGOT
$(document).on('submit', '#forgotUser', (err) => {
    let email = $('#email').val()
    let OTP = $('#OTP').val()
    let password1 = $('#password1').val()
    let password2 = $('#password2').val()
    if (password1 == password2) {
        $.ajax({
            url: '/forgot',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "X-CSRF-Token": $("#csrf").val(),
            },
            data: JSON.stringify({ email: email, OTP: OTP, password: password1 }),
            success: function (data) {
                showToast(new Toast("success", "toast-top-right", data.msg))
                setTimeout(() => {
                    window.location.href = '/login'
                }, 1000)
            },
            error: function (data) {
                showToast(new Toast("error", "toast-top-right", data.responseJSON.err))
            }
        })
    }else{
        showToast(new Toast("error", "toast-top-right", "Password not match!"))
    }
})

//Change password
$(document).on('submit', '#updateUser', (err) => {
    let curpass = $('#curpass').val()
    let password1 = $('#password1').val()
    let password2 = $('#password2').val()
    if (password1 == password2) {
        $.ajax({
            url: '/update-account',
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "X-CSRF-Token": $("#csrf").val(),
            },
            data: JSON.stringify({ curpass: curpass, password: password1 }),
            success: function (data) {
                showToast(new Toast("success", "toast-top-right", data.msg))
                setTimeout(() => {
                    window.location.href = '/login'
                }, 1000)
            },
            error: function (data) {
                showToast(new Toast("error", "toast-top-right", data.responseJSON.err))
            }
        })
    }else{
        showToast(new Toast("error", "toast-top-right", "Password not match!"))
    }
})

//FILTER FILM
$(document).on('submit', '#formFilter', () => {
    let genre = $('#optionGenre').val()
    let year = $('#amount-year')
    let minYear = year.attr('min')
    let maxYear = year.attr('max')
    let age = $('#amount-age')
    let minAge = age.attr('min')
    let maxAge = age.attr('max')
    let rating = $('#amount-rating')
    let minRating = rating.attr('min')
    let maxRating = rating.attr('max')
    $.ajax({
        url: '/film',
        type: 'POST',
        headers: {
            "X-CSRF-Token": $("#csrf").val(),
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ genre: genre, minYear: minYear, maxYear: maxYear, minAge: minAge, maxAge: maxAge, minRating: minRating, maxRating: maxRating }),
        success: (data) => {
            window.location.reload()
        }
    })
})
//click button filter
$(document).on('click', '.sparkle-button', () => {
    let isOpen = $('.sparkle-button').attr('value') != 'off'
    $('.filterForm').attr('hidden', isOpen)
    $('.sparkle-button').attr('value', isOpen ? 'off' : 'on')
})
//get film detail
function getDetail(idFilm) {
    window.location.href = '/film/detail/' + idFilm
}
//rating
$(document).on('click', '.rating', (event) => {
    let score = $(event.target).attr('value')
    if (typeof score != 'undefined') {
        console.log(score)
        $('.rating').find('path').attr('fill', 'white')
        $('.rating').find('path').slice(0, parseInt(score)).attr('fill', 'url(#b)')
        $('#submitRating').attr('value', score)
    }
})
//send rating to server
$(document).on('click', '#submitRating', () => {
    let score = $('#submitRating').attr('value')
    let idFilm = $('#favorite').attr('idFilm')
    if (typeof score != 'undefined' && typeof idFilm != 'undefined') {
        $.ajax({
            url: '/film/rating',
            type: 'POST',
            headers: {
                "X-CSRF-Token": $("#csrf").val(),
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ score: score, id: idFilm }),
            success: (data) => {
                showToast(new Toast("success", "toast-top-right", data.msg))
            },
            error: function (data) {
                showToast(new Toast("error", "toast-top-right", data.responseJSON.err))

            }
        })
    } else {
        showToast(new Toast("error", "toast-top-right", "Please choose star for rating!"))
    }
})
//COMMENT
$(document).on('keypress', '#contentCmt', (event) => {
    if (event.key == "Enter") {
        event.preventDefault();
        $('#submitCmt').click()
    }
})
//SEND COMMENT TO SERVER
$(document).on('submit', '#formCmt', () => {
    let username = $('#contentCmt').attr('username')
    let content = $('#contentCmt').val()
    $('#contentCmt').val('')
    let idFilm = $('#favorite').attr('idFilm')
    let time = new Date()
    time = `${time.getHours()}:${time.getMinutes()} ${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`
    if (typeof username != 'undefined') {
        $.ajax({
            url: '/film/cmt',
            type: 'POST',
            headers: {
                "X-CSRF-Token": $("#csrf").val(),
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ id: idFilm, username: username, content: content, time: time }),
            success: (data) => {
                $('#amoutCmt').html(parseInt($('#amoutCmt').html())+1)
                $(`<div class="comment">
                <div class="user">${username}:</div>
                <div class="content">${content}</div>
                <div class="time">${time}</div>
            </div>`).insertAfter($('#formCmt'))
                showToast(new Toast("success", "toast-top-right", data.msg))
            },
            error: function (data) {
                showToast(new Toast("error", "toast-top-right", data.responseJSON.err))
                setTimeout(() => {
                    $('#favorite').prop('checked', !$('#favorite').prop('checked'))
                }, 1000)
            }
        })
    }
})
//add or remove favorite list
$(document).on('change', '#favorite', () => {
    let isFavorite = $('#favorite').is(":checked")
    let idFilm = $('#favorite').attr('idFilm')
    $.ajax({
        url: '/addFavorite',
        type: 'POST',
        headers: {
            "X-CSRF-Token": $("#csrf").val(),
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ id: idFilm, favorite: isFavorite }),
        success: (data) => {
            showToast(new Toast("success", "toast-top-right", data.msg))
        },
        error: function (data) {
            showToast(new Toast("error", "toast-top-right", data.responseJSON.err))
            setTimeout(() => {
                $('#favorite').prop('checked', !$('#favorite').prop('checked'))
            }, 1000)
        }
    })
})
//Send OTP
$(document).on('click', '#sendOTP', () => {
    let email = $('#email').val()
    if (email == "") {
        showToast(new Toast('error', "toast-top-right", "Email không được trống!"));
    }
    else {
        $.ajax({
            url: '/sendOTP',
            type: 'POST',
            headers: {
                "X-CSRF-Token": $("#csrf").val(),
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ email: email }),
            success: function (data) {
                showToast(new Toast("success", "toast-top-right", data.msg))
            },
            error: function (data) {
                showToast(new Toast("error", "toast-top-right", data.responseJSON.err))
            }
        })
    }
})
//check passowrd
let timeoutPass1;
$(document).on('keypress', '#pass1', ()=>{
    if (timeoutPass1) clearTimeout(timeoutPass1);
    timeoutPass1 = setTimeout(()=>{
        if($('#pass1').val().length < 6){
            showToast(new Toast("error", "toast-top-right", "Password has at least 6 characters!"))
        }
    }, 1200)
})

let timeoutPass2;
$(document).on('keypress', '#pass2', ()=>{
    if (timeoutPass2) clearTimeout(timeoutPass2);
    timeoutPass2 = setTimeout(()=>{
        if($('#pass2').val() != $('#pass1').val()){
            showToast(new Toast("error", "toast-top-right", "Password not match!"))
        }
    }, 1200)
})

let timeoutPassFotgot1;
$(document).on('keypress', '#password1', ()=>{
    if (timeoutPassFotgot1) clearTimeout(timeoutPassFotgot1);
    timeoutPassFotgot1 = setTimeout(()=>{
        if($('#password1').val().length < 6){
            showToast(new Toast("error", "toast-top-right", "Password has at least 6 characters!"))
        }
    }, 1200)
})

let timeoutPassForgot2;
$(document).on('keypress', '#password2', ()=>{
    if (timeoutPassForgot2) clearTimeout(timeoutPassForgot2);
    timeoutPassForgot2 = setTimeout(()=>{
        if($('#password2').val() != $('#password1').val()){
            showToast(new Toast("error", "toast-top-right", "Password not match!"))
        }
    }, 1200)
})
  
class Toast {
    constructor(type, css, msg) {
        this.type = type;
        this.css = css;
        this.msg = msg;
    }
}
toastr.options.positionClass = "toast-top-right";
toastr.options.extendedTimeOut = 1000;
toastr.options.timeOut = 1000;
toastr.options.fadeOut = 250;
toastr.options.fadeIn = 250;

function showToast(t) {
    toastr.options.positionClass = t.css;
    toastr[t.type](t.msg);
}