import { Toast } from './Toast.js'
// enable edit
$(document).on('click', '.btn-edit', function () {
    $(this).attr('hidden', true);
    $(this).next().removeAttr('hidden');
    $(this).closest('tr').find('input[name="genre"]').removeAttr('readonly');
});
//show modal
$(document).on('click', '.btn-delete', function () {
    const form = $(this).closest('tr').find('form');
    const inp = form.find('input[name="genre"]').val()
    $('#contentDelete').html(`Thể loại: ${inp}?`)
    $('#delete').attr('value', inp)
    $('#deleteModel').modal('toggle')
})
//delete
$(document).on('click', '#delete', () => {
    $('#deleteModel').modal('toggle')
    let genre = $('#delete').attr('value')
    $.ajax({
        url: '/admin/genre',
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "X-CSRF-Token": $("#csrf").val(),
        },
        data: JSON.stringify({ genre: genre }),
        success: function (data) {
            let toast = new Toast("success", "toast-top-right", data.msg)
            toast.showToast()
            window.location.reload()
        },
        error: function (data) {
            let toast = new Toast("error", "toast-top-right", data.responseJSON.err)
            toast.showToast()
        }
    })
})
//put edit
$(document).on('click', '.btn-submit', function () {
    const submit_btn = $(this)
    const edit_btn = $(this).prev()
    const form = $(this).closest('tr').find('form');
    const old_genre = $(this).val();
    const inp = form.find('input[name="genre"]')
    const new_genre = inp.val();
    if (new_genre != '') {
        $.ajax({
            url: '/admin/genre',
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "X-CSRF-Token": $("#csrf").val(),
            },
            data: JSON.stringify({ old_genre: old_genre, new_genre: new_genre }),
            success: function (data) {
                let toast = new Toast("success", "toast-top-right", data.msg)
                toast.showToast()
                submit_btn.attr('hidden', 'true')
                edit_btn.removeAttr('hidden')
                inp.attr('readonly', true)
            },
            error: function (data) {
                let toast = new Toast("error", "toast-top-right", data.responseJSON.err)
                toast.showToast()

            }
        })
    } else {
        let toast = new Toast("error", "toast-top-right", "Vui lòng nhập thể loại mới!")
        toast.showToast()
    }
});
//add genre
// $(document).on('submit', '#formAddGenre', () => {
//     let genre = $('#new_genre').val()
//     $.ajax({
//         url: '/admin/genre',
//         type: 'POST',
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         headers: {
//             "X-CSRF-Token": $("#csrf").val(),
//         },
//         data: JSON.stringify({ genre: genre }),
//         success: function (data) {
//             let toast = new Toast("success", "toast-top-right", data.msg)
//             toast.showToast()
//             window.location.reload()
//         },
//         error: function (data) {
//             let toast = new Toast("error", "toast-top-right", data.responseJSON.err)
//             toast.showToast()
//         }
//     })
// })