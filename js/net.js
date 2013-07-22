$.getJSON("http://jsonip.appspot.com?callback=?", function (data) {
	var _dat = data.ip;
	$.post('post/ip.php', {
		'ip': _dat.substr(0, _dat.lastIndexOf("."))
	}, function(data) {
		console.log(data);
		$.get('ip', function (data) {
			var _lines = data.split("\n");
			for (i in _lines) {
				var mat = _lines[i].split('.');
				if (mat.length > 1)
					addPoint(mat[0] - 100, mat[1] - 100, mat[2] - 100);
			}
			renderer.render(scene, camera);
			$("#knight").addClass('lsd');
		});
	});
});

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

$("#net").append(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 200);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0xfafafa, 0.004);

function addPoint(x, y, z) {
	var sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 64, 64), new THREE.MeshBasicMaterial({color: 0xcccccc}));
	sphere.position.set(x, y, z);

	var lineGeo = new THREE.Geometry();
	lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));
	lineGeo.vertices.push(new THREE.Vector3(x, y, z));

	var line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({color: 0xcccccc, fog: true}))

	scene.add(sphere);
	scene.add(line);
}

function moveCamera(x, y, z) {
	camera.position.set(x, y, z);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	renderer.render(scene, camera);
}

$('#net > canvas').mousemove(function(e) {

	var t = Math.atan((e.pageX - (window.innerWidth / 2)) / 200),
	p = -Math.atan((e.pageY - (window.innerHeight / 2)) / 200);

	var x = 200 * Math.sin(t) * Math.cos(p),
	z = 200 * Math.cos(t) * Math.cos(p),
	y = 200 * Math.sin(p);

	moveCamera(x, y, z);
})