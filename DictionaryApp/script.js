const wrapper = document.querySelector('.wrapper'),
searchInput = wrapper.querySelector('input'),
synonyms = wrapper.querySelector('.synonyms .list'),
example = wrapper.querySelector('.example .details'),
infoText = wrapper.querySelector('.info-text'),
volumeIcon = wrapper.querySelector('.word i'),
removeIcon = wrapper.querySelector('.search span')
let audio;

function data(result, word) {
  if(result.title){
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>.`;
}else{
    console.log(result)
    wrapper.classList.add("active")
    let definitions = result[0].meanings[0].definitions[0]
    document.querySelector(".word p").innerText = result[0].word
    document.querySelector(".meaning span").innerText = definitions.definition
    document.querySelector(".example span").innerText = definitions.example
    audio = new Audio(result[0].phonetics[0].audio)

    if (result[0].phonetics[0].audio == '') {
      volumeIcon.style.display = "none"
    } else {
      volumeIcon.style.display = "block"
    }
    
    if (definitions.synonyms[0] == undefined) {
      synonyms.parentElement.style.display = "none"
    } else {
      synonyms.parentElement.style.display = "block"
      synonyms.innerHTML = ""
      for (let i=0; i<3; i++) {
        let tag = `<span onclick=search('${definitions.synonyms[i]}')>${definitions.synonyms[i]}</span>`
        synonyms.insertAdjacentHTML('beforeend', tag)
      }
    }
    
    if (definitions.example == undefined) {
      example.parentElement.style.display = "none"
    }

    if (result[0].phonetics[0].text == undefined) {
      let phonetic = `${result[0].meanings[0].partOfSpeech}`
      document.querySelector(".word span").innerText = phonetic
    } else {
      phonetic = `${result[0].meanings[0].partOfSpeech} ${result[0].phonetics[0].text}`
      document.querySelector(".word span").innerText = phonetic
    }
  }
}

function search(word) {
  searchInput.value = word
  fetchApi(word)
  wrapper.classList.remove("active")
}

function fetchApi(word) {
  wrapper.classList.remove("active")
  infoText.style.color = "#000"
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  fetch(url).then(res => res.json()).then(result => data(result, word))
}

searchInput.addEventListener('keyup', e=> {
  if(e.key === "Enter" && e.target.value){
      fetchApi(e.target.value)
  }
})

volumeIcon.addEventListener("click", () => {
    audio.play();
})

removeIcon.addEventListener("click", () => {
  searchInput.value = ""
  searchInput.focus()
  wrapper.classList.remove("active")
  infoText.style.color = "#9a9a9a"
  infoText.innerHTML = `Type a word and press enter to get meaning, example, pronunciation, and synonyms of that typed word` 
})