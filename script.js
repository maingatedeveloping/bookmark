const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal')
const bookMarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmarks-container')
// modalClose.setAttribute('title', 'close modal')
//or title='close modal' @html

//Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

//Modal Event Listerners
modalShow.addEventListener("click", showModal)

modalClose.addEventListener('click', e => {
    modal.classList.remove('show-modal')
})

window.addEventListener('click', e => {
    e.target === modal ?  modal.classList.remove('show-modal')
    : false
})


let bookmarks = [];

//Validate Form
function Validate(nameValue, urlValue) {
    const regex = /((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/g
    const found = regex.test(urlValue)
    if(!nameValue || !urlValue) {
        alert("Please submit values for both fields.")
        return false;
    }

    if(!found) {
        alert('Please provide a valid web address')
        return false
    }
    return true;
}


//Build Book Marks DOM
function buildBookMarks() {
    //
    bookmarkContainer.textContent = ''

    //Build items
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;

        //Item
        const item = document.createElement('div');
        item.classList.add('item');

        //close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-trash');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookMark('${url}')`);

        //Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        //Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        //Append to bookmarks container
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo);
        bookmarkContainer.appendChild(item);
    })
}

//Fetch bookmarks
function fetchBookmarks() {
    //Get bookmarks from localStorage if available
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    } else {
        //Create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Maingate Design',
                url: 'https://maingate.com',
            },
        ]
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookMarks()
}

// Delete Bookmark
function deleteBookMark(url) {
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url) {
            bookmarks.splice(i,1);
        }
    })
    //Update bookmarks array in loclastorage, repopulate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}
 

//Handle Data from Form
function storeBookMark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://', 'httpss://')) {
        urlValue = `https://${urlValue}`
    }

    if(!Validate(nameValue,urlValue)) {
        return false;
    }

    let bookmark = {
        name: nameValue,
        url: urlValue,
    }

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    // bookMarkForm.reset();
    websiteNameEl.value = '';
    websiteUrlEl.value = '';
    websiteNameEl.focus();
}

// Submit Form
bookMarkForm.addEventListener('submit', storeBookMark)

//On Load, Fetch Bookmarks
 fetchBookmarks();
console.log(bookmarks)
