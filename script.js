const firebaseConfig = {
    apiKey: "AIzaSyCYgrVmfFDMm2gAwB1o2rg7jsJCqtBTOVA",
    authDomain: "book-website-3d3f1.firebaseapp.com",
    projectId: "book-website-3d3f1",
    storageBucket: "book-website-3d3f1.firebasestorage.app",
    messagingSenderId: "64124055853",
    appId: "1:64124055853:web:b44d8e52a4b369a81ca3a4",
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase initialized:", firebase.apps.length > 0);

firebase.auth().onAuthStateChanged((user) => {
  const logoutBtn = document.getElementById("logout-btn");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

  if (user) {
    logoutBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
  } else {
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  firebase.auth().signOut()
    .then(() => {
      console.log("User signed out.");
      showToast("Logged out successfully!");
    })
    .catch((error) => {
      console.error("Sign out error:", error);
    });
});



const elements = {
    navbar: document.querySelector('.navbar'),
    loginBtn: document.getElementById('login-btn'),
    signupBtn: document.getElementById('signup-btn'),
    bookmarksLink: document.getElementById('bookmarks-link'),
    
    loginModal: document.getElementById('login-modal'),
    signupModal: document.getElementById('signup-modal'),
    bookModal: document.getElementById('book-modal'),
    closeBtns: document.querySelectorAll('.close'),
    showSignup: document.getElementById('show-signup'),
    showLogin: document.getElementById('show-login'),
    
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    
    booksContainer: document.getElementById('books-container'),
    genresContainer: document.getElementById('genres-container'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    
    toast: document.getElementById('toast')
};

const state = {
    currentUser: null,
    userData: null,
    books: [],
    filteredBooks: [],
    bookmarks: [],
    genres: [
  { name: "Fiction", image: "imgs/genreBg.png", link: "fiction.html" },
  { name: "Science", image: "imgs/genreBg.png", link: "science.html" },
  { name: "History", image: "imgs/genreBg.png", link: "history.html" },
  { name: "Fantasy", image: "imgs/genreBg.png", link: "fantasy.html" },
  { name: "Romance", image: "imgs/genreBg.png", link: "romance.html" },
  { name: "Mystery", image: "imgs/genreBg.png", link: "mystery.html" }
]
,
    currentBook: null
};

function init() {
    setupEventListeners();
    loadBooks();
    checkAuthState();
    renderFeaturedBooks();
}


async function loadBooks() {
    try {
        const snapshot = await db.collection('books').limit(12).get();
        if (!snapshot.empty) {
            state.books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
            state.books = [
                {
                    id: "1",
                    title: "The Great Gatsby",
                    author: "F. Scott Fitzgerald",
                    cover: "https://i.pinimg.com/736x/53/bb/0b/53bb0bbfce247a40cf744b8b89de4c17.jpg",
                    genre: "Fiction",
                    description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
                    rating: 4.2,
                    bookUrl:"https://dn790005.ca.archive.org/0/items/in.ernet.dli.2015.184960/2015.184960.The-Great-Gatsby.pdf"
                },
                {
                    id: "2",
                    title: "To Kill a Mockingbird",
                    author: "Harper Lee",
                    cover: "https://i.pinimg.com/736x/52/c4/5e/52c45e2f8b708794bcc3653265d9211c.jpg",
                    genre: "Fiction",
                    description: "To Kill a Mockingbird is a novel by Harper Lee published in 1960. Instantly successful, widely read in high schools and middle schools in the United States, it has become a classic of modern American literature.",
                    rating: 4.3,
                    bookUrl: "https://www.raio.org/TKMFullText.pdf"
                },
                {
                    id: "3",
                    title: "1984",
                    author: "George Orwell",
                    cover: "https://i.pinimg.com/736x/19/e3/a8/19e3a8dd99a01b2e44e21b54ebe7d154.jpg",
                    genre: "Dystopian",
                    description: "Nineteen Eighty-Four: A Novel, often published as 1984, is a dystopian novel by English novelist George Orwell. It was published in June 1949 as Orwell's ninth and final book completed in his lifetime.",
                    rating: 4.5,
                    bookUrl: "https://www.clarkchargers.org/ourpages/auto/2015/3/10/50720556/1984.pdf"
                },
                {
                    id: "4",
                    title: "Pride and Prejudice",
                    author: "Jane Austen",
                    cover: "https://i.pinimg.com/736x/36/35/00/3635001cee01cf44993d9364bc5777da.jpg",
                    genre: "Romance",
                    description: "Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book.",
                    rating: 4.7,
                    bookUrl: "https://giove.isti.cnr.it/demo/eread/Libri/joy/Pride.pdf"
                },
                {
                    id: "5",
                    title: "The Hobbit",
                    author: "J.R.R. Tolkien",
                    cover: "https://i.pinimg.com/736x/04/57/a1/0457a1f48fac843b67c87b23b295bea6.jpg",
                    genre: "Fantasy",
                    description: "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published in 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize.",
                    rating: 4.8,
                    bookUrl: "https://rsd2-alert-durden-reading-room.weebly.com/uploads/6/7/1/6/6716949/the_hobbit_tolkien.pdf"
                },
                {
                    id: "6",
                    title: "The Catcher in the Rye",
                    author: "J.D. Salinger",
                    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    genre: "Fiction",
                    description: "The Catcher in the Rye is a novel by J. D. Salinger, partially published in serial form in 1945-1946 and as a novel in 1951. It was originally intended for adults but is often read by adolescents.",
                    rating: 3.8,
                    bookUrl: "https://giove.isti.cnr.it/demo/eread/Libri/sad/Rye.pdf"
                },
                {
                    id: "7",
                    title: "A Tale of Two Cities",
                    author: "Charles Dickens",
                    cover: "https://i.pinimg.com/736x/00/c0/0b/00c00b9283088b9e71cd13c1e8918b08.jpg",
                    genre: "History",
                    description: "A Tale of Two Cities by Charles Dickens is a historical novel set in London and Paris during the French Revolution. It follows Dr. Manette’s release from prison and reunion with his daughter Lucie, exploring themes of sacrifice, redemption, and the turmoil of revolution.",
                    rating: 3.8,
                    bookUrl: "https://www.gutenberg.org/files/98/old/2city12p.pdf"
                },
                {
                    id: "8",
                    title: "It Ends with Us",
                    author: "Colleen Hoover",
                    cover: "https://i.pinimg.com/736x/2b/67/60/2b6760353435b8ef1a3437385a381039.jpg",
                    genre: "Romance",
                    description: "It Ends with Us by Colleen Hoover is a romance novel about Lily Bloom, who falls for Ryle Kincaid but soon faces his abusive behavior. As her past love, Atlas, reappears, Lily must choose between love and breaking the cycle of abuse. The story highlights strength, healing, and the courage to walk away.",
                    rating: 3.8,
                    bookUrl:"https://icrrd.com/public/media/15-05-2021-052358It-Ends-with-Us.pdf"
                },
                {
                    id: "9",
                    title: "Enceladus",
                    author: "Brandon Q. Morris",
                    cover: "https://i.pinimg.com/736x/fb/fd/f6/fbfdf6f74407b6dcc68f595033a739ca.jpg",
                    genre: "Science Fiction",
                    description: "The Enceladus Mission by Brandon Q. Morris is a hard sci-fi novel about an international crew traveling to Saturn's moon Enceladus after a robot probe finds signs of life. Aboard the spaceship ILSE, they face extreme challenges while exploring the moon's icy surface and hidden ocean, highlighting human resilience and the pursuit of discovery.",
                    rating: 3.8,
                    bookUrl: ""
                },
                {
                    id: "10",
                    title: "The Turn of the Screw",
                    author: "Henry James",
                    cover: "https://books.google.co.in/books/publisher/content?id=1sgbEQAAQBAJ&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U3h-25vzEEohblfqdzGLZSinJfaVQ&w=1280",
                    genre: "Mystery",
                    description: "The Turn of the Screw by Henry James is a gothic novella about a governess who believes two orphaned children in her care are haunted by ghosts. As she tries to protect them, her mental state unravels, leading to a tragic ending and leaving readers unsure if the ghosts are real or imagined.",
                    rating: 3.8,
                    bookUrl: "https://www.ibiblio.org/ebooks/James/Turn_Screw.pdf"
                }

            ];
        }
        
        state.filteredBooks = [...state.books];
        renderBooks();
        renderGenres();
    } catch (error) {
        showToast("Error loading books. Please try again later.");
        console.error("Error loading books:", error);
    }
}
function renderFeaturedBooks() {
    const featuredContainer = document.getElementById('featured-books');
    if (!featuredContainer) return;

    const featuredBooks = state.books.filter(book => book.featured);
    
    featuredContainer.innerHTML = featuredBooks.map(book => `
        <div class="book-card" onclick="showBookDetails('${book.id}')">
            <img src="${book.cover}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <div class="rating">${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5 - Math.floor(book.rating))}</div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let interval;
    
    function initCarousel() {
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        startAutoSlide();
    }
    
    function changeSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    function startAutoSlide() {
        clearInterval(interval);
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            changeSlide(currentIndex);
        }, 2000);
    }
    
    // Dot click event
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeSlide(index);
            startAutoSlide(); 
        });
    });
    
    initCarousel();
});

function renderBooks() {
    elements.booksContainer.innerHTML = '';
    
    state.filteredBooks.forEach(book => {
        const isBookmarked = state.bookmarks.includes(book.id);
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <img src="${book.cover}" alt="${book.title}" class="book-cover">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-actions">
                    <button class="btn btn-outline read-btn">Read</button>
                    <button class="bookmark-btn ${isBookmarked ? 'active' : ''}">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `;
        
        const bookmarkBtn = bookCard.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBookmark(book.id, bookmarkBtn);
        });
        
        const readBtn = bookCard.querySelector('.read-btn');
        readBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!state.currentUser) {
                showLoginModal();
                showToast("Please login to read books");
            } else if (book.bookUrl) {
        window.open(book.bookUrl, '_blank');
        } else {
        showToast("This book doesn't have a PDF link.");
        }
    });
        
        bookCard.addEventListener('click', () => showBookDetails(book));
        elements.booksContainer.appendChild(bookCard);
    });
}

function renderGenres() {
    elements.genresContainer.innerHTML = '';
    
    state.genres.forEach(genre => {
        const genreCard = document.createElement('div');
        genreCard.className = 'genre-card';
        genreCard.style.backgroundImage = `url(${genre.image})`;
        genreCard.innerHTML = `
            <div class="genre-overlay">
                <h3>${genre.name}</h3>
            </div>
        `;
        
        genreCard.addEventListener('click', () => {
            window.location.href = genre.link;
        });
        
        elements.genresContainer.appendChild(genreCard);
    });
}

function filterByGenre(genre) {
    state.filteredBooks = state.books.filter(book => book.genre === genre);
    renderBooks();
    window.scrollTo({
        top: document.querySelector('#featured').offsetTop - 80,
        behavior: 'smooth'
    });
}

function showBookDetails(book) {
    state.currentBook = book;
    const isBookmarked = state.bookmarks.includes(book.id);
    
    const modalContent = document.querySelector('.book-modal-content');
    modalContent.innerHTML = `
        <div class="book-modal-cover">
            <img src="${book.cover}" alt="${book.title}">
        </div>
        <div class="book-modal-info">
            <h2 class="book-modal-title">${book.title}</h2>
            <p class="book-modal-author">by ${book.author}</p>
            
            <div class="book-modal-meta">
                <span><i class="fas fa-book-open"></i> ${book.pages || 'N/A'} pages</span>
                <span><i class="fas fa-star"></i> ${book.rating || 'N/A'}/5</span>
                <span><i class="fas fa-calendar-alt"></i> ${book.year || 'N/A'}</span>
                <span><i class="fas fa-tag"></i> ${book.genre || 'General'}</span>
            </div>
            
            <p class="book-modal-description">${book.description}</p>
            
            <div class="book-modal-actions">
                <button class="btn btn-primary read-online-btn">
                    <i class="fas fa-book-reader"></i> Read Online
                </button>
                <button class="btn btn-outline download-btn">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="bookmark-btn ${isBookmarked ? 'active' : ''}">
                    <i class="fas fa-bookmark"></i> ${isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
            </div>
        </div>
    `;
    
    const modalBookmarkBtn = modalContent.querySelector('.bookmark-btn');
    modalBookmarkBtn.addEventListener('click', () => {
        toggleBookmark(book.id, modalBookmarkBtn);
    });
    
    const readOnlineBtn = modalContent.querySelector('.read-online-btn');
    readOnlineBtn.addEventListener('click', () => {
    if (!state.currentUser) {
        showLoginModal();
        showToast("Please login to read books");
    } else if (book.bookUrl) {
        window.open(book.bookUrl, '_blank');  // Open PDF in new tab
    } else {
        showToast("This book doesn't have a PDF link.");
    }
});
    
    const downloadBtn = modalContent.querySelector('.download-btn');
    downloadBtn.addEventListener('click', () => {
        if (!state.currentUser) {
            showLoginModal();
            showToast("Please login to download books");
        } else {
            showToast(`Downloading ${book.title}`);
        }
    });
    
    elements.bookModal.style.display = 'block';
}

function toggleBookmark(bookId, button) {
    if (!state.currentUser) {
        showLoginModal();
        showToast("Please login to bookmark books");
        return;
    }
    
    const index = state.bookmarks.indexOf(bookId);
    if (index === -1) {
        state.bookmarks.push(bookId);
        button.classList.add('active');
        if (button.textContent.includes('Bookmark')) {
            button.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
        }
        showToast("Book added to your bookmarks");
    } else {
        state.bookmarks.splice(index, 1);
        button.classList.remove('active');
        if (button.textContent.includes('Bookmarked')) {
            button.innerHTML = '<i class="fas fa-bookmark"></i> Bookmark';
        }
        showToast("Book removed from your bookmarks");
    }
    
    if (state.currentUser) {
        db.collection('users').doc(state.currentUser.uid).update({
            bookmarks: state.bookmarks
        }).catch(error => {
            console.error("Error updating bookmarks:", error);
        });
    }
}

function searchBooks() {
    const query = elements.searchInput.value.toLowerCase();
    if (!query.trim()) {
        state.filteredBooks = [...state.books];
    } else {
        state.filteredBooks = state.books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query) ||
            book.genre.toLowerCase().includes(query)
        );
    }
    renderBooks();
}

function showBookmarks() {
    if (!state.currentUser) {
        showLoginModal();
        showToast("Please login to view your bookmarks");
        return;
    }
    
    if (state.bookmarks.length === 0) {
        state.filteredBooks = [];
        showToast("You don't have any bookmarks yet");
    } else {
        state.filteredBooks = state.books.filter(book => 
            state.bookmarks.includes(book.id)
        );
    }
    renderBooks();
    
    window.scrollTo({
        top: document.querySelector('#featured').offsetTop - 80,
        behavior: 'smooth'
    });
}

function showLoginModal() {
    elements.loginModal.style.display = 'block';
    elements.signupModal.style.display = 'none';
}

function showSignupModal() {
    elements.signupModal.style.display = 'block';
    elements.loginModal.style.display = 'none';
}

function showToast(message, duration = 3000) {
    elements.toast.textContent = message;
    elements.toast.style.display = 'block';
    
    setTimeout(() => {
        elements.toast.style.display = 'none';
    }, duration);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            state.currentUser = userCredential.user;
            loadUserData();
            elements.loginModal.style.display = 'none';
            showToast(`Welcome back!`);
        })
        .catch((error) => {
            showToast(error.message);
        });
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            state.currentUser = userCredential.user;
            
            return userCredential.user.sendEmailVerification();
        })
        .then(() => {
            return db.collection('users').doc(state.currentUser.uid).set({
                name: name,
                email: email,
                bookmarks: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            showToast(`Verification email sent to ${email}`);
            elements.signupModal.style.display = 'none';
        })
        .catch((error) => {
            showToast(error.message);
        });
}

async function loadUserData() {
    if (state.currentUser) {
        try {
            const doc = await db.collection('users').doc(state.currentUser.uid).get();
            if (doc.exists) {
                state.userData = doc.data();
                state.bookmarks = doc.data().bookmarks || [];
                renderBooks(); // Update bookmarks display
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }
}

function checkAuthState() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            state.currentUser = user;
            await loadUserData();
            updateAuthUI();
        } else {
            state.currentUser = null;
            state.userData = null;
            state.bookmarks = [];
            updateAuthUI();
        }
    });
}

function updateAuthUI() {
    if (state.currentUser) {
        elements.loginBtn.style.display = 'none';
        elements.signupBtn.style.display = 'none';
    } else {
        elements.loginBtn.style.display = 'block';
        elements.signupBtn.style.display = 'block';
    }
}

function setupEventListeners() {
    elements.loginBtn.addEventListener('click', showLoginModal);
    elements.signupBtn.addEventListener('click', showSignupModal);
    elements.showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        elements.loginModal.style.display = 'none';
        elements.signupModal.style.display = 'block';
    });
    elements.showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        elements.signupModal.style.display = 'none';
        elements.loginModal.style.display = 'block';
    });
    
    elements.closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.loginModal.style.display = 'none';
            elements.signupModal.style.display = 'none';
            elements.bookModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === elements.loginModal) elements.loginModal.style.display = 'none';
        if (e.target === elements.signupModal) elements.signupModal.style.display = 'none';
        if (e.target === elements.bookModal) elements.bookModal.style.display = 'none';
    });
    
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.signupForm.addEventListener('submit', handleSignup);
    
    // Update the bookmarks link event listener
elements.bookmarksLink.addEventListener('click', (e) => {
  e.preventDefault();
  if (!state.currentUser) {
    showLoginModal();
    showToast("Please login to view your bookmarks");
  } else {
    // Store the current state in localStorage before navigating
    localStorage.setItem('bookNestState', JSON.stringify({
      currentUser: state.currentUser,
      bookmarks: state.bookmarks
    }));
    window.location.href = "bookmarks.html";
  }
});

    
    elements.searchBtn.addEventListener('click', searchBooks);
    elements.searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchBooks();
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('DOMContentLoaded', function() {
    const writingsContainer = document.getElementById('writings-container');
    const submitWritingBtn = document.getElementById('submit-writing-btn');
    const writingModal = document.getElementById('writing-modal');
    const authCheck = document.getElementById('auth-check');
    
    function loadWritings() {
        db.collection('writings')
            .orderBy('timestamp', 'desc')
            .limit(20)
            .onSnapshot(snapshot => {
                writingsContainer.innerHTML = '';
                
                snapshot.forEach(doc => {
                    const writing = doc.data();
                    addWritingToDOM(writing);
                });
                
                if (snapshot.empty) {
                    writingsContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-book-open"></i>
                            <p>No writings yet. Be the first to share!</p>
                        </div>
                    `;
                }
            });
    }
    
    function addWritingToDOM(writing) {
        const writingCard = document.createElement('div');
        writingCard.className = 'writing-card';
        writingCard.innerHTML = `
            <h3 class="writing-title">${writing.title}</h3>
            <div class="writing-content">${writing.content.replace(/\n/g, '<br><br>')}</div>
            <div class="writing-meta">
                <span class="writing-author">${writing.authorName || 'Anonymous'}</span>
                <span class="writing-date">${new Date(writing.timestamp?.toDate()).toLocaleDateString()}</span>
            </div>
        `;
        writingsContainer.prepend(writingCard); // Add new writings at the top
    }
    
    function showWritingModal() {
        writingModal.style.display = 'block';
        
        if (!state.currentUser) {
            authCheck.innerHTML = `
                <div class="login-prompt">
                    <h2>Login Required</h2>
                    <p>Please login to submit your writing</p>
                    <div class="auth-actions">
                        <button id="modal-login-btn" class="btn btn-primary">Login</button>
                        <button id="modal-signup-btn" class="btn btn-outline">Sign Up</button>
                    </div>
                </div>
            `;
            
            document.getElementById('modal-login-btn').addEventListener('click', () => {
                writingModal.style.display = 'none';
                showLoginModal();
            });
            
            document.getElementById('modal-signup-btn').addEventListener('click', () => {
                writingModal.style.display = 'none';
                showSignupModal();
            });
        } else {
            authCheck.innerHTML = `
                <div class="writing-form">
                    <h2>Submit Your Writing</h2>
                    <form id="submit-writing-form">
                        <div class="form-group">
                            <input type="text" id="writing-title" placeholder="Title" required>
                        </div>
                        <div class="form-group">
                            <textarea id="writing-content" placeholder="Your writing..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Publish</button>
                    </form>
                </div>
            `;
            
            document.getElementById('submit-writing-form').addEventListener('submit', handleSubmitWriting);
        }
    }
    
    function handleSubmitWriting(e) {
        e.preventDefault();
        
        const title = document.getElementById('writing-title').value;
        const content = document.getElementById('writing-content').value;
        
        db.collection('writings').add({
            title: title,
            content: content,
            authorId: state.currentUser.uid,
            authorName: state.userData?.name || state.currentUser.email.split('@')[0],
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            showToast("Your writing has been published!");
            writingModal.style.display = 'none';
        })
        .catch(error => {
            showToast("Error publishing your writing");
            console.error("Error:", error);
        });
    }
    
    submitWritingBtn.addEventListener('click', showWritingModal);
    
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            writingModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === writingModal) {
            writingModal.style.display = 'none';
        }
    });
    
    loadWritings();
});
if (window.location.pathname.includes('bookmarks.html')) {
        checkUserAndRenderBookmarks();
    }

// Add this function to handle chunked bookmark loading
async function loadBookmarkedBooks(bookmarkIds) {
  const chunkSize = 10;
  const chunks = [];
  
  // Split bookmarks into chunks of 10
  for (let i = 0; i < bookmarkIds.length; i += chunkSize) {
    chunks.push(bookmarkIds.slice(i, i + chunkSize));
  }
  
  // Query each chunk separately
  const bookPromises = chunks.map(chunk => 
    db.collection('books')
      .where(firebase.firestore.FieldPath.documentId(), 'in', chunk)
      .get()
  );
  
  // Wait for all queries to complete
  const snapshots = await Promise.all(bookPromises);
  
  // Combine results
  return snapshots.flatMap(snapshot => 
    snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => bookmarkIds.indexOf(a.id) - bookmarkIds.indexOf(b.id))
  );
}
// Update the bookmarks link handler
elements.bookmarksLink.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!state.currentUser) {
    showLoginModal();
    showToast("Please login to view your bookmarks");
  } else {
    try {
      // Save current state
      localStorage.setItem('bookNestUser', JSON.stringify({
        uid: state.currentUser.uid,
        bookmarks: state.bookmarks
      }));
      
      // Navigate to bookmarks page
      window.location.href = "bookmarks.html";
    } catch (error) {
      console.error("Error navigating to bookmarks:", error);
      showToast("Error loading bookmarks");
    }
  }
});