var canvas = document.getElementById('mycanvas');
// if (!canvas || !canvas.getContext) return false;
var ctx = canvas.getContext('2d');

var startX, startY, x, y, borderWidth = 10, isDrawing = false;
$('#mycanvas').mousedown(function(e) {
    isDrawing = true;
    startX = e.pageX - $(this).offset().left - borderWidth;
    startY = e.pageY - $(this).offset().top - borderWidth;
})
.mousemove(function(e) {
    if (!isDrawing) return;
    x = e.pageX - $(this).offset().left - borderWidth;
    y = e.pageY - $(this).offset().top - borderWidth;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
    startX = x;
    startY = y;
})
.mouseup(function() {
    isDrawing = false;
})
.mouseleave(function() {
    isDrawing = false;
});

$('#penColor').change(function() {
    ctx.strokeStyle = $(this).val();
});
$('#penWidth').change(function() {
    ctx.lineWidth = $(this).val();
});

$('#erase').click(function() {
    if (!confirm('You sure?')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
$('#save').click(function() {
    var base64data = canvas.toDataURL().split(',')[1];
    var data = atob(base64data);
    var buff = new ArrayBuffer(data.length);
    var arr = new Uint8Array(buff);
    var image = canvas.toDataURL("image/png")
    var blob, i, dataLen;

    // blobの生成
    for( i = 0, dataLen = data.length; i < dataLen; i++){
        arr[i] = data.charCodeAt(i);
    }
    blob = new Blob([arr], {type: 'image/png'});

    formdata = new FormData();
    formdata.append('image', blob);

    $.ajax({
        type: "POST",
        url: '/upload',
        dataType: 'json',
        processData : false,
        contentType : false,
        data: formdata,
        success: function(result) {
            console.dir(result);
            if (!result.saved) return;

            var img = $('<img>').attr({
                width: 100,
                height: 50,
                src: canvas.toDataURL()
            });
            // var link = $('<a>').attr({
            //     href: canvas.toDataURL().replace('image/png', 'application/octet-stream'),
            //     download: new Date().getTime() + '.png'
            // });
            // $('#gallery').append(link.append(img.addClass('thumbnail')));
            $('#gallery').append(img.addClass('thumbnail'));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },
        error: function() {
            console.dir("error");
        }
    });
});
