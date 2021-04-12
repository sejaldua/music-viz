var pieces, radius, fft, mapMouseX, mapMouseY, toggleBtn, audio, audios, uploadBtn, uploadedAudio, uploadAnim;

// COLOR SCHEME
// background, inner (bass), middle (mid), outer (treble)
var colorPalette1 = ["#000", "#561637", "#753456", "#b34c75" ]; //pink
var colorPalette2 = ["#000", "#CF8963", "#F2A164", "#F1822D"];  //orange
var colorPalette3 = ["#000", "#799985", "#4c956c", "#1a9a6d"];  //green
var colorPalette4 = ["#000", "#739EAD", "#87CEFA", "#1E90FF"];  //blue
var colorPalette5 = ["#000", "#d3bde8", "#A479B7", "#B735EE"];  //purple
var palettes = [colorPalette1, colorPalette2, colorPalette3, colorPalette4, colorPalette5];
var state = 0;
var colorPalette = palettes[state];
var uploadLoading = false;

var artists = ["Siddhartha Khosla", "A R I Z O N A", "Bleachers", "Desiigner", "A.R. Rahman", "Khalid", "Shakey Graves", "Mumford & Sons", "Travis Scott", "Glass Animals (feat. Denzel Curry)"];
var songs = ["Jack in AA", "Where I Wanna Be", "Wild Heart", "Panda", "Dil Se Re", "Vertigo", "Family and Genus", "I Will Wait", "HIGHEST IN THE ROOM", "Tokyo Drifting"];
var tracks = ["tracks/TashSultana-Notion.mp3",
		"tracks/ARIZONA-Where.mp3",
		"tracks/MacMiller-Dunno.mp3",
		"tracks/Desiigner-Panda.mp3",
		"tracks/RoyIrwin-DemonsCave.mp3",
		"tracks/Khalid-Vertigo.mp3",
		"tracks/ShakeyGraves-Family.mp3",
		"tracks/Mumford-IWillWait.mp3",
		"tracks/TravisScott-Highest.mp3",
		"tracks/GlassAnimalsDenzelCurry-TokyoDrifting.mp3"];

function preload() {
	audio = loadSound("tracks/JackInAA.mp3");
}

function manual_load(path) {
	uploadedAudio = loadSound(path, uploadedAudioPlay);
}


function uploaded(file) {
	console.log(file);
	uploadLoading = true;
	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}


function uploadedAudioPlay(audioFile) {

	uploadLoading = false;

	if (audio.isPlaying()) {
		audio.pause();
	}

	audio = audioFile;
	audio.loop();
}


function setup() {

	uploadAnim = select('#uploading-animation');
	createCanvas(windowWidth, windowHeight);
	toggleBtn = createButton("Play / Pause");
	uploadBtn = createFileInput(uploaded);
	uploadBtn.addClass("upload-btn");
	toggleBtn.addClass("toggle-btn");
	toggleBtn.mousePressed(toggleAudio);
	fft = new p5.FFT();
	audio.pause();
}

function draw() {

	// Add a loading animation for the uploaded track
	if (uploadLoading) {
		uploadAnim.addClass('is-visible');
	} else {
		uploadAnim.removeClass('is-visible');
	}


	background(colorPalette[0]);
	noFill();
	fft.analyze();
	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy("treble");
	var mid = fft.getEnergy("mid");

	var map_mid = map(mid, 0, 255, -radius, radius);
	var scale_mid = map(mid, 0, 255, 1, 1.5);

	var map_treble = map(treble, 0, 255, -radius, radius);
	var scale_treble = map(treble, 0, 255, 1, 1.5);

	var map_bass = map(bass, 0, 255, -100, 800);
	var scale_bass = map(bass, 0, 255, 0, 0.8);

	mapMouseX = map(mouseX, 0, width, 4, 8);
	mapMouseY = map(mouseY, 0, height, windowHeight / 4, windowHeight/2);

	pieces = mapMouseX;
	radius = mapMouseY;

	translate(windowWidth / 2, windowHeight / 2);

	strokeWeight(1);

	for (i = 0; i < pieces; i += 0.5) {

		rotate(TWO_PI / pieces);


		/*----------  BASS  ----------*/
		push();
		strokeWeight(5);
		stroke(colorPalette[1]);
		scale(scale_bass);
		rotate(frameCount * -0.5);
		line(map_bass, radius / 2, radius, radius);
		line(-map_bass, -radius / 2, radius, radius);
		pop();



		/*----------  MID  ----------*/
		push();
		strokeWeight(0.5);
		stroke(colorPalette[2]);
		scale(scale_mid);
		line(map_mid, radius / 2, radius, radius);
		line(-map_mid, -radius / 2, radius, radius);
		pop();


		/*----------  TREBLE  ----------*/
		push();
		stroke(colorPalette[3]);
		scale(scale_treble);
		line(map_treble, radius / 2, radius, radius);
		line(-map_treble, -radius / 2, radius, radius);
		pop();

	}

}


function toggleAudio() {
	if (audio.isPlaying()) {
		console.log("playing");
		audio.pause();
	} else {
		console.log("not playing");
		audio.play();
	}
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

$("#tracknum").focus(function() {$(this).val("");});

function play_new_song(index) {
	manual_load(tracks[index]);
	this.document.getElementById("fixed-div").innerHTML = artists[index]+"<br>"+songs[index];
	$("#fixed-div").slideDown();
	this.setTimeout(function() {
		this.document.getElementById("fixed-div").innerHTML = "";
		$("#fixed-div").slideUp()}, 5000);
}

$("#body").dblclick(function() {
	console.log(state);
	if (state < 4)
		state += 1;
	else
		state = 0;
	colorPalette = palettes[state];
})

window.addEventListener('keypress', function(e) {
	var keyCode = e.keyCode;

	// audio switching
	if (keyCode >= 48 && keyCode <= 57) {
		var index = keyCode - 48;
		play_new_song(index);
	}

	// color scheme switching [Enter]
	else if (keyCode == 13) {
		if (state < 4)
			state += 1;
		else
			state = 0;
	}


	// play/pause toggle [Space]
	else if (keyCode == 32) {
		toggleAudio();
	}
	
	colorPalette = palettes[state];
});