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
						}, 10);
					});
				}

			} else {
				_loaded();
			}
		})(0);
	});
});

function _loaded() {
	renderer.render(scene, camera);
	$("#net").html(renderer.domElement);
	$('#net > canvas').mousemove(function (e) {

		var t = Math.atan((e.pageX - (window.innerWidth / 2)) / 200),
		p = -Math.atan((e.pageY - (window.innerHeight / 2)) / 200);

		var x = 200 * Math.sin(t) * Math.cos(p),
		z = 200 * Math.cos(t) * Math.cos(p),
		y = 200 * Math.sin(p);

		moveCamera(x, y, z);
	});
	$("#knight").addClass('lsd');
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 200);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0xfafafa, 0.004);

function addPoint(x, y, z, callback) {
	var sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 64, 64), new THREE.MeshBasicMaterial({color: 0xcccccc}));
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

function moveCamera(x, y, z) {
	camera.position.set(x, y, z);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	renderer.render(scene, camera);
}

$(window).resize(function () {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
});