/*
 * 格式化Date
 */
Date.prototype.format = function(fmt) {
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

$('#test').click(function() {
    /*
     * 绘制canvas
     */
    let now = new Date()
    let canvas = document.getElementById('myCanvas')
    let img = document.getElementById('myImage')
    let context = canvas.getContext('2d')

    now = now.format('MM.dd.yyyy')

    context.drawImage(img, 0, 0, 285, 267)
    context.font = '48px 微软雅黑'
    context.fillText(now, 0, 48)
    
    /*
     * POST图片文件并取得链接
     */
    let url = canvas.toDataURL('image/png')
    let file = dataURLtoFile(url, 'signImage.png')

    let fd = new FormData()
    fd.append('smfile', file)
    fd.append('ssl', true)

    $('#result').text('Uploading...')

    $.post('https://sm.ms/api/upload', fd, (data, status) => {
        if (status === 'success') {
            let json = eval('(' + data + ')')
            if (json.code === 'success') {
                $('#result').text(`[img]${json.data.url}[/img]`)
            } else {
                alert('Upload error: ' + json.msg)
            }
        } else {
            alert('Post error.')
        }
    })
})
