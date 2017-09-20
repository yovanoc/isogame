window.onload = function () {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,

        // tileWidth = width / 13.5,
        // tileHeight = height * 2 / 19.5;
        tileWidth = 60,
        tileHeight = 30;

    // context.translate(width / 2, 50);
    context.translate(tileWidth / 2, 0);
    // context.translate(tileWidth / 2, tileHeight);
    // context.translate(0, - tileHeight / 2);

    var grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0.3, 0.45, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0.35, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    for (var y = 0; y < grid.length; y++) {
        var row = grid[y];
        for (var x = 0; x < row.length; x++) {
            drawBlock(x, y, row[x], randomColor());
            // drawTile(x, y, randomColor());
        }
    }

    function shadeBlend(p,c0,c1) {
        var n=p<0?p*-1:p,u=Math.round,w=parseInt;
        if(c0.length>7){
            var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
            return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
        }else{
            var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
            return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
        }
    }

    function draw()
    {
        for (var x = 0; x < 25; x++) {
            for (var y = 0; y < 25; y++) {
                //drawBlock(x, y, Math.floor(Math.random() * 5));
            }
        }
    }

    function drawBlock(x, y, z, color)
    {
        // var top = "#eeeeee",
        //     right = "#cccccc",
        //     left = "#999999";
        var top = color;
        var right = shadeBlend(-0.5, color);
        var left = shadeBlend(0.3, color);

        context.save();
        // context.translate((x - y) * tileWidth / 2, (x + y) * tileHeight / 2);

        if (y & 1)
        {
            context.translate(x * tileWidth + tileWidth / 2,
                                y * tileHeight / 2 - y * 1 / 2); // 1 = thickness
        }
        else
        {
            context.translate(x * tileWidth, y * tileHeight / 2 - y * 1 / 2); // 1 = thickness
        }

        // Draw top
        context.beginPath();
        context.moveTo(0, -z * tileHeight);
        context.lineTo(tileWidth / 2, tileHeight / 2 - z * tileHeight);
        context.lineTo(0, tileHeight - z * tileHeight);
        context.lineTo(-tileWidth / 2, tileHeight / 2 - z * tileHeight);
        context.closePath();
        context.fillStyle = top;
        context.fill();

        // Draw left
        context.beginPath();
        context.moveTo(-tileWidth / 2, tileHeight / 2 - z * tileHeight);
        context.lineTo(0, tileHeight - z * tileHeight);
        context.lineTo(0, tileHeight);
        context.lineTo(-tileWidth / 2, tileHeight / 2);
        context.closePath();
        context.fillStyle = left;
        context.fill();

        // Draw right
        context.beginPath();
        context.moveTo(tileWidth / 2, tileHeight / 2 - z * tileHeight);
        context.lineTo(0, tileHeight - z * tileHeight);
        context.lineTo(0, tileHeight);
        context.lineTo(tileWidth / 2, tileHeight / 2);
        context.closePath();
        context.fillStyle = right;
        context.fill();

        context.restore();
    }

    function drawTile(x, y, color)
    {
        context.save();
        // context.translate((x - y) * tileWidth / 2, (x + y) * tileHeight / 2);

        if (y & 1)
        {
            context.translate(x * tileWidth + tileWidth / 2,
                                y * tileHeight / 2 - y * 1 / 2); // 1 = thickness
        }
        else
        {
            context.translate(x * tileWidth, y * tileHeight / 2 - y * 1 / 2); // 1 = thickness
        }

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(tileWidth / 2, tileHeight / 2);
        context.lineTo(0, tileHeight);
        context.lineTo(-tileWidth / 2, tileHeight / 2);
        context.closePath();
        context.fillStyle = color;
        context.fill();

        context.restore();
    }

    function randomColor()
    {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
};
