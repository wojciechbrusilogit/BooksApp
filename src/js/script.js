{
    'use strict';

    const select = {
        templateOf: {
            bookTemplate: '#template-book',
        },
        containerOf: {
            booksList: '.books-list',
            images: '.book__image',
            filters: '.filters',
        }
    };

    const templates = {
        bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML)
    };


    class Books {
        constructor() {
            const thisBooks = this;

            thisBooks.initData();
            thisBooks.getElements();
            thisBooks.render();
            thisBooks.initActions();
            thisBooks.determineRatingBgc();
        }

        initData() {
            const thisBooks = this;
            thisBooks.data = dataSource.books;
            thisBooks.favoriteBooks = [];
            thisBooks.filters = [];
        }

        getElements() {
            const thisBooks = this;

            thisBooks.bookContainer = document.querySelector(select.containerOf.booksList);
        }

        render() {
            const thisBooks = this;

            for (let book of thisBooks.data) {
                const ratingBgc = thisBooks.determineRatingBgc(book.rating);
                book.ratingBgc = ratingBgc;

                const ratingWidth = book.rating * 10;
                book.ratingWidth = ratingWidth;

                const generateHTML = templates.bookTemplate({
                    id: book.id,
                    name: book.name,
                    image: book.image,
                    rating: book.rating,
                    price: book.price,
                    ratingBgc: book.ratingBgc,
                    ratingWidth: book.ratingWidth
                });

                const elem = utils.createDOMFromHTML(generateHTML);
                const bookContainer = document.querySelector(select.containerOf.booksList);
                bookContainer.appendChild(elem);
            }
        }

        initActions() {
            const thisBooks = this;
            const favoriteBooks = this;
            thisBooks.bookContainer.addEventListener('dblclick', function (event) {
                event.preventDefault();

                const image = event.target.offsetParent;
                const bookId = image.getAttribute('data-id');

                if (!thisBooks.favoriteBooks.includes(bookId)) {
                    image.classList.add('favorite');
                    thisBooks.favoriteBooks.push(bookId);
                } else {
                    const indexOfBooks = thisBooks.favoriteBooks.indexOf(bookId);
                    thisBooks.favoriteBooks.splice(indexOfBooks, 1);
                    image.classList.remove('favorite');
                }
            });

            const bookFilter = document.querySelector(select.containerOf.filters);

            bookFilter.addEventListener('click', function (cb) {
                const clickedElement = cb.target;

                if (clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter') {
                    if (clickedElement.checked) {
                        thisBooks.filters.push(clickedElement.value);
                    } else {
                        const indexOfValue = thisBooks.filters.indexOf(clickedElement.value);
                        thisBooks.filters.splice(indexOfValue, 1);
                    }
                }
                thisBooks.filterBooks();
            });
        }

        filterBooks() {
            const thisBooks = this;
            for (let book of thisBooks.data) {
                let shouldBeHidden = false;
                const hiddenBooks = document.querySelector(select.containerOf.images + '[data-id = "' + book.id + '"]');
                for (const filter of thisBooks.filters) {
                    if (!book.details[filter]) {
                        shouldBeHidden = true;
                        break;
                    }
                }
                if (shouldBeHidden) {
                    hiddenBooks.classList.add('hidden');
                } else {
                    hiddenBooks.classList.remove('hidden');
                }
            }
        }

        determineRatingBgc(rating) {

            let background = '';

            if (rating < 6) {
                background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
            } else if (rating > 6 && rating <= 8) {
                background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
            } else if (rating > 8 && rating <= 9) {
                background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
            } else if (rating > 9) {
                background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
            }
            return background;
        }

    }
    new Books();
}