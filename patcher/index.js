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

function initPatcher(patches) {
    const patcherSettings = {
        language: 'en',
        requireValidation: false,
        allowDropFiles: true
    };
    RomPatcherWeb.initialize(patcherSettings, patches)
}

function generatePatchData(patch) {
    let patchData = {
        file: patch.path,
        name: patch.name,
        outputName: patch.name
    };
    return patchData;
}

function addDataToSite(data, params) {
    const hack = data.content.find(i => i.id === params);
    if (!hack) {
        document.getElementById('title').textContent = "🫣 Sorry... I did not create this thing yet"
        return;
    }
    if (hack.type != 'hack') {
        document.getElementById('title').textContent = `❌ ${hack.name} is not a patch`
        return;
    }
    document.getElementById('title').textContent = `⬇️ ${hack.name} Patcher ⬇️`
    document.getElementById('patcher').removeAttribute('hidden')

    //Get all patches from the hack
    // let patches = []
    // hack.downloads.forEach(patch => {
    //     patches.push(generatePatchData(patch));
    // });

    // patchesObject = {
    //     file: '',
    //     patches: patches
    // };

    initPatcher(generatePatchData(hack.downloads[0]));
}

document.addEventListener("DOMContentLoaded", function() {
    
    // Get Content
    var params = new URLSearchParams(window.location.search);
    var contentParam = params.get('id')
    var data = getDbContent().then(data => addDataToSite(data, contentParam));
})