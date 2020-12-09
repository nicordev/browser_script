function convertLinks() {
  let inputElement = document.getElementById('raw-links');
  let rawLinks = inputElement.value.split(',%20');

  if (rawLinks.length === 0) {
    rawLinks = inputElement.value.split(', ');
  }

  let links = rawLinks.map(convertShareLink);
  let resultElement = document.getElementById('result');
  let previewElement = document.getElementById('preview');

  links.map(link => {
    appendResultLink(resultElement, link);
    appendPreviewLink(previewElement, link);
  });
}

function appendResultLink(resultElement, link) {
  let element = document.createElement('div');

  element.classList.add('result-link');
  element.textContent = link;
  resultElement.appendChild(element);
}

function appendPreviewLink(previewElement, link) {
  let figureElement = document.createElement('figure');
  let imgElement = document.createElement('img');
  let figcaptionElement = document.createElement('figcaption');

  imgElement.classList.add('preview-link');
  imgElement.setAttribute('src', link);
  imgElement.setAttribute('alt', link);
  figcaptionElement.textContent = link;

  figureElement.appendChild(imgElement);
  figureElement.appendChild(figcaptionElement);
  previewElement.appendChild(figureElement);
}

function convertShareLink(url) {
  let regexToCatchId = 'file/d/([a-zA-Z0-9\-_]+)/view';
  let matches = url.match(regexToCatchId);

  if (!matches || matches.length < 1) {
    return;
  }

  let id = matches[1];

  return createGoogleLinkFromId(id);
}

function createGoogleLinkFromId(id) {
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

document.getElementById('run-button').addEventListener('click', convertLinks);