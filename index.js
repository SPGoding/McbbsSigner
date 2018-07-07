/*
 * 格式化Date
 */
Date.prototype.format = function (fmt) {
    let o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
            )
        }
    }
    return fmt
}

/*
 * 将dataURL转换为File
 */
function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
}

$(document).ready(() => {
    $("#time").val((new Date()).format('MM.dd.yyyy'))

    $('#do').click(function () {
        /*
         * 绘制canvas
         */
        $('#log').text('Drawing...')

        let time = $("#time").value()
        let canvas = document.getElementById('myCanvas')
        let img = document.getElementById('myImage')
        let context = canvas.getContext('2d')

        context.drawImage(img, 0, 0, 285, 267)
        context.font = '48px 微软雅黑'
        context.fillText(time, 0, 48)

        /*
         * POST图片文件并取得链接
         */
        $('#log').text('Posting...')

        let url = canvas.toDataURL('image/png')
        let file = dataURLtoFile(url, 'signImage.png')

        let formData = new FormData()
        formData.append('smfile', file)
        formData.append('ssl', true)

        $.ajax({
            url: 'https://sm.ms/api/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: data => {
                if (data.code === 'success') {
                    $('#log').text(`[img]${data.data.url}[/img]`)
                } else {
                    $('#log').text('Upload error: ' + data.msg)
                }
            }
        })
    })
})
