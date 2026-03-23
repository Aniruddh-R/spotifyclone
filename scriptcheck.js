let currentSong = new Audio();
let songs = [];
let currFolder = "";

// time
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// GET SONGS fetch
async function getSongs(folder) {
  currFolder = folder;
  let res = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let text = await res.text();
  let div = document.createElement("div");
  div.innerHTML = text;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let i = 0; i < as.length; i++) {
    let href = as[i].href;
    if (href.endsWith(".mp3")) {
      songs.push(decodeURI(href.split(`/${folder}/`)[1]));
    }
  }

  // show all the songs in the playlist
  let songUL = document.querySelector(".songlist ul");
  songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img src="music.svg">
        <div class="info">
          <div>${song}</div>
          <div>Aniruddh</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
        </div>
      </li>`;
  }

  // attach an event listener to each song
  Array.from(document.querySelectorAll(".songlist li")).forEach((li) => {
    li.addEventListener("click", () => {
      let track = li.querySelector(".info div").innerText.trim();
      playMusic(track);
    });
  });

  return songs;
}

// play music
function playMusic(track, pause = false) {
  currentSong.src = `${currFolder}/${track}`;
  if (!pause) {
    currentSong.play();
    document.getElementById("play").src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// get the metadata of the folder
async function displayAlbums() {
  let res = await fetch(`http://127.0.0.1:5500/songs/`);
  let text = await res.text();
  let div = document.createElement("div");
  div.innerHTML = text;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);

  for (let i = 0; i < array.length; i++) {
    let e = array[i];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-2)[0];
      try {
        let metaRes = await fetch(
          `http://127.0.0.1:5500/songs/${folder}/info.json`,
        );
        let meta = await metaRes.json();
        cardContainer.innerHTML += `
          <div data-folder="${folder}" class="card">
            <div class="play"></div>
            <img src="/songs/${folder}/cover.jpg">
            <h2>${meta.title}</h2>
            <p>${meta.description}</p>
          </div>`;
      } catch {
        console.log("No info.json in", folder);
      }
    }
  }

  // load the playlist whenever the card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((card) => {
    card.addEventListener("click", async () => {
      let folder = card.dataset.folder;
      songs = await getSongs(`songs/${folder}`);
      playMusic(songs[0]);
    });
  });
}

// MAIN Function
async function main() {
  await getSongs("songs/hindi");
  playMusic(songs[0], true);
  displayAlbums();

  let playBtn = document.getElementById("play");
  let prevBtn = document.getElementById("previous");
  let nextBtn = document.getElementById("next");

  // attach an event listener top play next and previous
  playBtn.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playBtn.src = "pause.svg";
    } else {
      currentSong.pause();
      playBtn.src = "play.svg";
    }
  });

  // listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an eventlistener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.clientWidth) * 100;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // add an event listener to the next
  nextBtn.addEventListener("click", () => {
    let currentTrack = decodeURI(currentSong.src.split("/").pop());
    let index = songs.indexOf(currentTrack);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // add an event listener to the previous
  prevBtn.addEventListener("click", () => {
    let currentTrack = decodeURI(currentSong.src.split("/").pop());
    let index = songs.indexOf(currentTrack);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // add an event listener to volume
  document.querySelector(".volume input").addEventListener("input", (e) => {
    currentSong.volume = e.target.value / 100;
  });

  // add event listener to mute the track
  document.querySelector(".volume img").addEventListener("click", (e) => {
    if (currentSong.volume > 0) {
      currentSong.volume = 0;
      e.target.src = "mute.svg";
    } else {
      currentSong.volume = 0.5;
      e.target.src = "volume.svg";
    }
  });

  // sidebar
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });
}

main();
