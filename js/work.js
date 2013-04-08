var
cHeight,
cWidth,
i = 0,
cCanvas = document.getElementById('codeq'),
cCtx = cCanvas.getContext('2d'),
cImage = new Image(),
cImage2 = new Image();

cWidth = cCanvas.width = window.innerWidth * 0.3;
cHeight = cCanvas.height = 300;

cImage.onload = function() {
	cCtx.drawImage(cImage,0,-80);
	var anim = setInterval(function() {
		if (i <= cImage.width - cWidth) {
			cCtx.clearRect(0,0,cWidth,cHeight);
			cCtx.drawImage(cImage,-i*0.7,-80 - i/2.8);
			i += 5;
		} else {
			clearInterval(anim);
			var del = cImage.width - cWidth;
			i = 0;
			anim = setInterval(function() {
				if (i <= 800) {
					cCtx.clearRect(0,0,cWidth,cHeight);
					cCtx.drawImage(cImage,-del*0.7,-80 - del/2.8 - i);
					cCtx.drawImage(cImage2,-del*0.7,520 - del/2.8 - i);
					i += 5;
				} else {
					clearInterval(anim);
				}
			},10);
		}
	},10);
};
cImage.src = 'images/work/c1.png';
cImage2.src = 'images/work/c2.png';