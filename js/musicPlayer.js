// Pegando items do html
let cd_label = document.getElementById('track-img');
let music_name = document.querySelector('.track-name');
let artist_name = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-music');
let prev_btn = document.querySelector('.prev-music');
let next_btn = document.querySelector('.next-music');

let seek_slider = document.querySelector('.seek-slider');
let volume_slider = document.querySelector('.volume-slider');
let current_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
const curr_track = document.createElement('audio');

// variaveis
let music_index = 0;
let is_playing = false;
let update_timer;
let interval;
let isBumping = false;

//Array com as musicas
const music_list =
[
    {
        img: './imgs/cd-label1.jpg',
        name: 'Found The Way',
        artist: 'Sad:Puppy',
        music: './musics/track1.mp3',
        bpm: 123.75,
        startBump: 30, // Em segundos representados pelo duraction do elemento audio.
    },
    {
        img: 'https://storage.zamona.net/upload/photos/2021/03/acrazefeatcherish-do-it-to-it-acraze-mix.webp',
        name: 'Do It To It',
        artist: 'Acraze feat. Cherish',
        music: 'https://zamona.net/storage/music/19331.mp3',
        bpm: 124.9,
        startBump: 32, // Em segundos representados pelo duraction do elemento audio.
    },
    {
        img: 'https://i.discogs.com/IG6w1hmWORZqrKIhkypcXHPAhvhbOZlfyn9VvVET198/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE2MTc4/NzgxLTE2MDQ3Nzg1/ODktMzEzNy5qcGVn.jpeg',
        name: 'Dying Breed',
        artist: 'Five Finger Death Punch',
        music: './musics/track2.mp3',
        bpm: 195.7,
        startBump: 0, // Em segundos representados pelo duraction do elemento audio.
    },
    {
        img: 'https://i.ytimg.com/vi/YHVr8XfuhIA/sddefault.jpg',
        name: 'Stand By Me now',
        artist: 'Playmen (Gioni Remix)',
        music: './musics/track3.mp3',
        bpm: 140,
        startBump: 0, // Em segundos representados pelo duraction do elemento audio.
    },
    {
        img: 'https://i.ytimg.com/vi/QiJC4FKWppM/sddefault.jpg',
        name: 'Write this down',
        artist: '2Pac & Pop Smoke (ft. Various Rap Artists)',
        music: 'https://ia802209.us.archive.org/10/items/2pac-pop-smoke-write-this-down-ft-biggie-dmx-eazy-e-ice-cube-dr-dre-nwa-nipsey-snoop-dogg/2pac-pop-smoke-write-this-down-ft-biggie-dmx-eazy-e-ice-cube-dr-dre-nwa-nipsey-snoop-dogg.mp3',
        bpm: 190,
        startBump: 0, // Em segundos representados pelo duraction do elemento audio.
    }
]

// Carrega a primeira musica 
loadTrack(music_index);

// Função que carrega a musica.
function loadTrack(music_index)
{
    clearInterval(update_timer);
    reset();

    // pega a musica da array.
    curr_track.src = music_list[music_index].music;
    curr_track.load();

    // pega o banner referente a musica.
    cd_label.style.backgroundImage = "url(" + music_list[music_index].img + ")";

    // pegando nome da musica  e o artista.
    music_name.textContent = music_list[music_index].name;
    artist_name.textContent = music_list[music_index].artist;

    // Intervalo do timer.
    update_timer = setInterval(setUpdate, 1000/* 1 segundo */);

    // Listener para pular para proxima musica sozinho.
    curr_track.addEventListener('ended', nextTrack);
}

// Função para resetar o timer.
function reset()
{
    current_time.textContent = '00:00';
    total_duration.textContent = '00:00';
    seek_slider.value = 0;
}

// Função para tocar / pausar musica.
async function playpauseMusic()
{
    is_playing ? pauseMusic() : playMusic();
    curr_track.volume = volume_slider.value / 100;
}

// Função para iniciar musica.
function playMusic()
{
    curr_track.play();
    is_playing = true;
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-3x"></i>';
}

// Função para pausar a usica.
function pauseMusic()
{
    clearInterval(interval);
    isBumping = false;
    curr_track.pause();
    is_playing = false;
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-3x"></i>';
}

// Pulando para a proxima musica
function nextTrack()
{
    (music_index < music_list.length - 1) ? music_index++ : music_index = 0;
    loadTrack(music_index);
    clearInterval(interval);
    isBumping = false;
    playMusic();
}

// Voltando para musica anterior
function prevTrack()
{
    (music_index > 0) ? music_index -= 1 : music_index = music_list.length - 1;
    loadTrack(music_index);
    clearInterval(interval);
    isBumping = false;
    playMusic();
} 

// Função relacionada a posição da musica
function seekTo() { curr_track.currentTime = curr_track.duration * (seek_slider.value / 100); }

// Função para setar volume
function setVolume() { curr_track.volume = volume_slider.value / 100; }

// Funcção para atualizar posição do tempo da musica no slider
function setUpdate()
{
    let seek_position = 0;
    if(!isNaN(curr_track.duration))
    {
        seek_position = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seek_position;

        let current_minutes = Math.floor(curr_track.currentTime / 60);
        let current_seconds = Math.floor(curr_track.currentTime - current_minutes * 60);
        let duration_minutes = Math.floor(curr_track.duration / 60);
        let duration_seconds = Math.floor(curr_track.duration - duration_minutes * 60);

        if(current_seconds < 10) current_seconds = "0" + current_seconds;
        if(duration_seconds < 10) duration_seconds = "0" + duration_seconds;
        if(current_minutes < 10) current_minutes = "0" + current_minutes;
        if(duration_minutes < 10) duration_minutes = "0" + duration_minutes;

        // Passando pro html
        current_time.textContent = current_minutes + ":" + current_seconds;
        total_duration.textContent = duration_minutes + ":" + duration_seconds;

        // Sistema para identificar quando começar a animação do beat
        // e quando parar no finald a musica
        if(curr_track.currentTime >= music_list[music_index].startBump)
        {
            
            if(!isBumping && is_playing) {interval = setInterval(bump, 60000 / music_list[music_index].bpm); isBumping = true;}
        }
    }
}

// Função responsavel por esperar antes de fazer algo.
function delay(time) { return new Promise(resolve => setTimeout(resolve, time)); }

// Função para animação de beat.
async function bump(){
    cd_label.classList.add('bump');
    await delay(60);
    cd_label.classList.remove('bump');
}
