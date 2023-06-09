function createCard(post) {
    const { rendered: title } = post.title;
    const { rendered: content } = post.content;
    const author = post._embedded.author[0];
    const date = new Date(post.date);
    const imageUrl = post.featured_media;
    const type = post.type;
    const categories = post.categories;

    const col = document.createElement('div');
    col.classList.add('col-4');

    const card = document.createElement('div');
    card.classList.add('p-card--highlighted');

    const cardCintentDiv = document.createElement('div');
    cardCintentDiv.innerHTML = content;

    // Show or hide the image inside the figure
    const figure = cardCintentDiv.querySelector('figure');
    if (figure !== null) {
        const figureImage = figure.querySelector('img');

        figureImage.onerror = function () {
            figure.style.display = 'none';
        };
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('p-card__content');

    // Fetch category data
    const categoryLink = `https://admin.insights.ubuntu.com/wp-json/wp/v2/categories/${categories}`;
    const categoriesElement = document.createElement('span');
    categoriesElement.textContent = categories.toString().toUpperCase();
    contentDiv.appendChild(categoriesElement);

    fetch(categoryLink)
        .then(response => response.ok ? response.json() : null)
        .then(categoryData => {
            if (categoryData) {
                const categoryName = categoryData.name;
                categoriesElement.textContent = categoryName.toString().toUpperCase();
            }
        })
        .catch(error => {
            console.log('Category data retrieval error:', error);
        });

    const separator1 = document.createElement('hr');
    separator1.classList.add('p-separator');

    const separator = document.createElement('hr');
    separator.classList.add('p-separator');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = "Post cover image";

    const titleElement = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleElement.appendChild(titleLink);
    titleLink.href = post.link;
    titleLink.textContent = title;

    const authorElement = document.createElement('a');
    authorElement.href = author.link;
    authorElement.textContent = author.name;

    const dateElement = document.createElement('p');
    const formattedDate = `${date.getDate()} ${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`;
    const byText = document.createTextNode("By ");
    dateElement.appendChild(byText);
    dateElement.appendChild(authorElement);
    dateElement.appendChild(document.createTextNode(` on ${formattedDate}`));
    dateElement.classList.add('p-heading--6');

    const typeElement = document.createElement('p');
    const capitalized = type.replace(/^\w/, (c) => c.toUpperCase());
    typeElement.textContent = capitalized;

    // Append elements to the card
    contentDiv.appendChild(separator1);
    contentDiv.appendChild(image);
    contentDiv.appendChild(titleElement);
    contentDiv.appendChild(cardCintentDiv);
    contentDiv.appendChild(dateElement);
    contentDiv.appendChild(separator);
    contentDiv.appendChild(typeElement);

    // Append the card to the page
    col.appendChild(card);
    card.appendChild(contentDiv);
    return col;
}

// Load data and create cards
fetch('https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json')
    .then(response => response.json())
    .then(data => {
        const root = document.getElementById('root');
        data.forEach(post => {
            const card = createCard(post);
            root.appendChild(card);
            setTimeout(() => {
                card.classList.add('show');
            }, 100);
        });
    })
    .catch(error => {
        console.log(error);
    });