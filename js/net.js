var _loaded = false;
$("#net").width(window.innerWidth).height(window.innerHeight).css("position", "absolute").mousemove(pivot);

$.post('post/ip.php', function(data) {
	$.get('ip', function (data) {
		var _lines = data.split("\n");
		(function _drawDots (i) {
			if (i < _lines.length) {
				$("#loading").attr("data-loaded", parseInt(i / _lines.length * 100));

				var mat = _lines[i].split('.');
				if (mat.length > 1) {
					addPoint(mat[0] - 100, mat[1] - 100, mat[2] - 100, function () {
						setTimeout(function () {
							_drawDots(i + 1);
						}, 40);
					});
				} else {
					_drawDots(i + 1);
				}

			} else {
				_loadedCallback();
			}
		})(0);
	});
});

function _loadedCallback() {	
	$("#net").html(renderer.domElement);
	$("#knight").addClass('lsd');
	_loaded = true;
	pivot(currPos);
}

var currPos = {pageX: 0, pageY: 0}

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 200);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0xfafafa, 0.004);

function addPoint(x, y, z, callback) {
	var sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({color: 0xcccccc}));
	sphere.position.set(x, y, z);

	var lineGeo = new THREE.Geometry();
	lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));
	lineGeo.vertices.push(new THREE.Vector3(x, y, z));

	var line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({color: 0xcccccc, fog: true}))

	scene.add(sphere);
	scene.add(line);

	if (callback) {
		callback();
	}
}

function pivot(e) {
	var t = Math.atan((e.pageX - (window.innerWidth / 2)) / 200),
	p = -Math.atan((e.pageY - (window.innerHeight / 2)) / 200);

	var x = 200 * Math.sin(t) * Math.cos(p),
	z = 200 * Math.cos(t) * Math.cos(p),
	y = 200 * Math.sin(p);

	if (_loaded) {
		moveCamera(x, y, z);
	} else {
		currPos = {pageX: e.pageX, pageY: e.pageY};
	}
}

function moveCamera(x, y, z) {
	camera.position.set(x, y, z);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	renderer.render(scene, camera);
}

$(window).resize(function () {
	$("#net").width(window.innerWidth).height(window.innerHeight);
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
});