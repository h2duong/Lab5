// // script.js

// buttons and form
let clearread = document.querySelectorAll("#button-group button");
let generate = document.querySelector("button[type=submit]");
let form = document.getElementById("generate-meme");

// canvas
let cvs = document.getElementById('user-image');
let context = cvs.getContext('2d');
let input = document.getElementById('image-input');

// volume and reading stuff
let volume = document.getElementById('volume-group');
let voiceSelect = document.getElementById('voice-selection');
let synth = window.speechSynthesis;
let voices = [];



const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO

  
  // clear canvas
  context.clearRect(0,0,400,400);

  // button toggle
  generate.disabled = false;
  clearread[0].disabled = true;
  clearread[1].disabled = true;
  
  // fill with black
  context.fillStyle = "black";
  context.fillRect(0,0,400,400);

  // draw image
  let dimensions = getDimmensions(400, 400, img.width, img.height);
  console.log(dimensions);
  context.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);



  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

input.addEventListener('change', () => {
  let url = URL.createObjectURL(input.files[0]);
  img.src = url;
  img.alt = input.files[0].name;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // get text
  let top = document.getElementById("text-top").value;
  let bottom = document.getElementById("text-bottom").value;
  
  // text styling
  context.font = "30px Papyrus";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText(top, 200, 50);
  context.fillText(bottom, 200, 370);
  
  // button toggle
  generate.disabled = true;
  clearread[0].disabled = false;
  clearread[1].disabled = false;
});

let clear = clearread[0];
let read = clearread[1];

clear.addEventListener('click', () => {
  
  // clear canvas
  context.clearRect(0, 0, 400, 400);

  //disable buttons
  generate.disabled = false;
  clear.disabled = true;
  read.disabled = true;
});


function populateVoiceList() {
  voiceSelect.remove(0);
  voices = synth.getVoices();
  voiceSelect.disabled = false;

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}


read.addEventListener('click', (e) => {
  e.preventDefault();


  let toptext = document.getElementById("text-top").value;
  let bottomtext = document.getElementById("text-bottom").value;

  let toputterance = new SpeechSynthesisUtterance(toptext);
  let bottomutterance = new SpeechSynthesisUtterance(bottomtext);

  let voicetouse = voiceSelect.selectedOptions[0].getAttribute('data-name');
  
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === voicetouse) {
      toputterance.voice = voices[i];
      bottomutterance.voice = voices[i];
    }
  }
  
  // adjust volumes and speak
  let vol = document.querySelector("input[type=range]");
  toputterance.volume = (vol.value)/100;
  bottomutterance.volume = (vol.value)/100;
  speechSynthesis.speak(toputterance);
  speechSynthesis.speak(bottomutterance);
  
})

volume.addEventListener('input', (e) => {
  let volrange = document.querySelector('input[type=range]').value;

  if (volrange == 0){
    document.querySelector('#volume-group img').src = 'icons/volume-level-0.svg';
  }
  else if (volrange <= 33){
    document.querySelector('#volume-group img').src = 'icons/volume-level-1.svg';
  }
  else if (volrange <= 66){
    document.querySelector('#volume-group img').src = 'icons/volume-level-2.svg';
  }
  else {
    document.querySelector('#volume-group img').src = 'icons/volume-level-3.svg';
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

