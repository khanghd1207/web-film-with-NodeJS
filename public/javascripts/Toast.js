export default class Toast {
    constructor(type, css, msg) {
        this.type = type;
        this.css = css;
        this.msg = msg;
    } 
    showToast() {
        toastr.options.positionClass = this.css;
        toastr[this.type](this.msg);
    }
}
toastr.options.positionClass = "toast-top-right";
toastr.options.extendedTimeOut = 1000;
toastr.options.timeOut = 1000;
toastr.options.fadeOut = 250;
toastr.options.fadeIn = 250;

export {Toast}