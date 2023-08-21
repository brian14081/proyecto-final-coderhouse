
class Photo {
    constructor(json){
        Object.assign(this, json);
    }
    showModal(){
        Swal.fire({
            width: '50rem',
            imageUrl: this.src.large2x,
            imageWidth: '60%',  
            showConfirmButton: false,  
            imageAlt: this.alt,
            footer: `<p>Foto por: ${this.photographer}</p>`
        });
    }
}

const API_KEY = '563492ad6f9170000100000124f75ece770b47a49b4bfa89770d506a';
const HEADERS = {
    method: 'GET', 
    headers: {
        Accept: 'application/json',
        Authorization: API_KEY
    }
}
let topBtn = document.getElementById('topBtn')
let loadMoreBtn = document.getElementById('loadMoreBtn');
let errorAlert = document.getElementById('errorAlert');
let clearInputButton = document.getElementById('clearInput');
let searchForm = document.getElementById('searchForm');
let gallery = document.getElementById('gallery');
let galleryContainer = document.getElementById('galleryContainer');
const removeAllChild = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
let pageIndex = 1;
let searchValue;
const fetchPhotos = async (baseURL) => {
    const res = await fetch(baseURL, HEADERS);
    const data = await res.json();
    return data;
}
const validateSearchValue = (searchValue) => {
    if (searchValue.length < 3){
        errorAlert.innerText = 'Debe introducir una palabra mayor a 3 letras.';
        setTimeout(() => {
            errorAlert.innerText = '';
        }, 1500);
    }else{
        return true;
    }
}
const generateHTML = (data, photoType) => {
    data.photos.forEach((photoObject) => {
        const photo = new Photo(photoObject);
        let newGalleryItem = document.createElement('article');
        newGalleryItem.classList.add('gallery__item');
        newGalleryItem.setAttribute('data-photo', photoType);
        newGalleryItem.innerHTML = `<img src="${photo.src.large}" alt="${photo.alt}"></img>`;
        galleryContainer.append(newGalleryItem);
        newGalleryItem.addEventListener('click', () => photo.showModal());
    });
}
const validateErrors = (data, searchValue) => {
    if (!data.next_page){
        loadMoreBtn.style.display = 'none'
    }
    if (data.photos.length === 0){
        let textError = document.createElement('h2');
        textError.innerText = `No se encontraron fotos de '${searchValue}'`;
        gallery.prepend(textError);
    }
}
const getSearchedPhotos = async (e) => {
    e.preventDefault();
    searchValue = e.target.querySelector('input').value;
    if (validateSearchValue(searchValue) === true){
        const data = await fetchPhotos(`https://api.pexels.com/v1/search?query=${searchValue}&per_page=16`);
        validateErrors(data, searchValue);
        removeAllChild(galleryContainer);
        generateHTML(data, 'search');
    }
}
const getMoreSearchedPhotos = async (index) => {
    const data = await fetchPhotos(`https://api.pexels.com/v1/search?query=${searchValue}&per_page=16&page=${index}`);
    validateErrors(data, searchValue);
    generateHTML(data, 'search');
}
const getInitialRandomPhotos = async (index) => {
    const data = await fetchPhotos(`https://api.pexels.com/v1/curated?per_page=16&page=${index}`);
    if (!data.next_page){
        loadMoreBtn.style.display = 'none'
    }
    generateHTML(data, 'curated');
}
const loadMorePhotos = () => {
    let index = ++pageIndex;
    let galleryItem = document.querySelector('article');
    let dataPhoto = galleryItem.getAttribute('data-photo')
    if (dataPhoto == 'curated'){
        getInitialRandomPhotos(index); 
    }else{
        getMoreSearchedPhotos(index); 
    }
}
const clearInputAndGallery = () => {
    let pageIndex = 1;
    document.getElementById('searchInput').value = '';
    if (gallery.childNodes.length === 5){
        removeAllChild(galleryContainer);
        getInitialRandomPhotos(pageIndex);
    }else{
        gallery.childNodes[0].remove();
        removeAllChild(galleryContainer);
        getInitialRandomPhotos(pageIndex);
    }
    loadMoreBtn.style.display = 'flex';
}
document.addEventListener('DOMContentLoaded', getInitialRandomPhotos(pageIndex));
searchForm.addEventListener('submit', (e) => getSearchedPhotos(e));
loadMoreBtn.addEventListener('click', () => loadMorePhotos());
clearInputButton.addEventListener('click', () => clearInputAndGallery());
window.addEventListener("scroll", () => {
    if (window.scrollY > 1){
        topBtn.style.display = 'flex';
    }else if(window.scrollY < 1){
        topBtn.style.display = 'none';
    }
})
let toggleTheme = document.getElementById('toggleTheme');
let ball = document.getElementById('ball');
let theme = localStorage.getItem('theme');
const enableDarkTheme = () => {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'darkTheme');
    ball.style.transform = 'translateX(20px)';
}
const disableDarkTheme = () => {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'normal');
    ball.style.transform = 'translateX(0)';
}
theme === 'darkTheme' ? enableDarkTheme() : disableDarkTheme();
toggleTheme.addEventListener('click', () => {
    theme = localStorage.getItem('theme');
    theme != 'darkTheme' ? enableDarkTheme() : disableDarkTheme();
});
