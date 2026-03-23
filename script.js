let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds} `;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < array.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //show all the songs in the playlist
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img class="" src="music.svg" alt="musiclogo" />
                <div class="info">
                  <div>${song.replaceAll("%20", " ")} </div>
                  <div>Aniruddh</div>
                </div>
                <div class="playnow">
                <span class="playnow">Play Now</span>
                <img src="play.svg " alt="" /></div>
      </li>`;
  }

  // attach an event listener to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li"),
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (tracks, pause = false) => {
  // let audio = new Audio("/songs/" + tracks);
  currentSong.src = `/${currFolder}/` + tracks;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(tracks);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
  }
  if (e.href.includes("/songs")) {
    let folder = e.href.split("/").slice(-2)[0];
    // get the metadat of the folder
    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
    let response = await a.json();
    console.log(response);
    cardContainer.innerHTML =
      cardContainer.innerHTML +
      `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-2 -2 28 28"
                  width="80"
                  height="80"
                  color="#000"
                  fill="#3be477"
                  stroke="#3be477"
                  stroke-width="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt="first song"
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`;
  }
}

//load the playlist whenever the card is clicked
Array.from(document.getElementsByClassName("card")).forEach((e) => {
  e.addEventListener("click", async (item) => {
    console.log(item, item.currentTarget.dataset);

    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    playMusic(songs[0]);
  });
});

async function main() {
  // get the lists of all the songs
  await getSongs("songs/hindi");
  playMusic(songs[0], true);

  //Display all the albums on the page

  diplayAlbums();

  // attach an event listener top play next and previous

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      pause.src = "play.svg";
    }
  });
  // listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML =
      `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add an eventlistener to seekbar
  (document.querySelector(".seekbar"),
    addEventListener("click", (e) => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = percent + "%";
      currentSong.currentTime = (currentSong.duration * percent) / 100;
    }));
  //add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });
  // add an event listener to the previous
  previous.addEventListener("click", () => {
    console.log("previous click");
    console.log(currentSong.src);
    if (index - 1 >= 0) {
      playMusic(songs[index + 1]);
    }
  });
  // add an event listener to the next
  next.addEventListener("click", () => {
    console.log("next click");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    console.log(songs, index);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", () => {
      console.log(e, e.target, e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    console.log(e.target);
    console.log("changing", e.target.src);

    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value =
        0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document.querySelector(".range").getElementsByTagName("input")[0].value =
        10;
    }
  });
}
main();
