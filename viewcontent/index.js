const userLocale = navigator.language || 'en-US';

function getDbContent() {
    return fetch('/data/database/content.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('File could not be loaded');
            }
            return response.json();
        })
}

function getDownloadLink(patch, name=null) {
    href = document.createElement('a')
    href.href = patch.path;
    if (!name) href.textContent = patch.name;
    else href.textContent = name;

    return href;
}

function addDataToSite(data, params) {
    const item = data.content.find(i => i.id === params);
    if (!item) {
        document.getElementById('title').textContent = "🫣 Sorry... I did not create this thing yet"
        return;
    }

    const title = document.getElementById('title');
    const desc = document.getElementById('description');
    const images = document.getElementById('images');
    const downloads = document.getElementById('downloads');
    const quickdownload = document.getElementById('quick-download');
    const authors = document.getElementById('authors');

    title.textContent = item.name;
    desc.textContent = item.description;

    //Authors
    authors.textContent = item.authors.join(' - ');

    //Images
    item.images.forEach(image => {

        imageElement = document.createElement('img');
        imageElement.src = image;
        images.appendChild(imageElement);

    });

    //Downloads
    if (item.downloads.length != 0) {

        quickdownload.appendChild(getDownloadLink(item.downloads[0], "Download"));
        document.getElementById('download-heading').textContent = "Versions";

        item.downloads.forEach(patch => {

            listItem = document.createElement('li')

            //Get date created
            if (patch.date != "") {
                var date = new Date(patch.date);
                var formattedDate = date.toLocaleDateString(userLocale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                listItem.textContent = `${formattedDate}: `
            }

            listItem.appendChild(getDownloadLink(patch));
            downloads.appendChild(listItem);

        })
    }
}

document.addEventListener("DOMContentLoaded", function() {
    
    // Get Content
    var params = new URLSearchParams(window.location.search);
    var contentParam = params.get('id')
    var data = getDbContent().then(data => addDataToSite(data, contentParam));
})