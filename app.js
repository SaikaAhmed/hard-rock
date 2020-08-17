const search = document.getElementById('search');
const result = document.getElementById('result');
const searchBtn = document.getElementById('searchSubmit');

const apiURL = 'https://api.lyrics.ovh/';

//call api
async function searchSong(term) {
	/*fetch(`${apiURL}${term}`).then(res => res.json()).then(data => console.log(data)); */
	const res = await fetch(`${apiURL}/suggest/${term}`);
	const data = await res.json();
	showData(data);
}
var lyricArry=[], i = 0;
async function showLyrics(artist, songTitle) {
	const res = await fetch(`${apiURL}v1/${artist}/${songTitle}`);
	const data = await res.json();
	//console.log(dataTarget);
	const lyrics = data.lyrics.replace(/(\n\r|\r\n|\r|\n)/g, '<br>');
	lyricArry[i++] = lyrics;
	//console.log(lyrics);
}


//show  song and artist 
function showData(data) {
	var output = '';
	let arr = data.data;
	//console.log(arr);
	for(let i=0; i<10; i++){
		var audio_src = arr[i].preview;
		output += `
		<div class="search-result col-md-8 mx-auto py-4">
                <!-- single result -->
                <div class="single-result row align-items-center my-3 p-3">
                    <div class="col-md-9">
                        <h3 class="lyrics-name">${i+1} - ${arr[i].title}</h3>
						<p class="author lead">Album by <span>${arr[i].artist.name}</span></p>
						<p>Listen The Song Preview:</p>
						<audio controls>
							<source src="${audio_src}" type="audio/mpeg">
							</audio>
						
                    </div>
                    <div class="col-md-3 text-md-right text-center">
						<button class="btn btn-success" data-toggle="collapse" data-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample" data-artist = "${arr[i].artist.name}" data-songTitle="${arr[i].title}">Get Lyrics</button>
						
                    </div>
                </div>
                
            </div>
            <div class="collapse single-lyrics text-center" id="collapseExample${i}">
            	<p></p>
            </div>
		`;
	}
	result.innerHTML = output;

	for(let j = 0; j<10; j++){
		const targetId = "collapseExample" + (j+1);
		showLyrics(arr[j].artist.name, arr[j].title, targetId);
	}

}

//fetch the input value
searchBtn.addEventListener('click', e => {
	const searchTerm = search.value.trim();
	if(!searchTerm){
		alert("Please write search term!");
	}
	else{
		searchSong(searchTerm);
	}
});

//get lyrics from button click

result.addEventListener('click', e =>{
	const clickedItem = e.target;
	if(clickedItem.tagName === 'BUTTON'){
		const artist = clickedItem.getAttribute('data-artist');
		const songTitle = clickedItem.getAttribute('data-songTitle');
		const dataTarget = clickedItem.getAttribute('data-target');
		const dataT = dataTarget.slice(dataTarget.length-1, dataTarget.length);
		console.log(lyricArry[dataT]);
		const song = `<h2 class="text-success mb-4">${songTitle}</h2> <pre class="lyric text-white">${lyricArry[dataT]}</pre>`;
		const parent = clickedItem.parentElement.parentElement.parentElement;
		const lastLyricChild = document.getElementById('dataTarget');
		if(lyricArry[dataT] != "")clickedItem.parentElement.parentElement.parentElement.innerHTML += (song);
		lyricArry[dataT] = "";
	}
});
