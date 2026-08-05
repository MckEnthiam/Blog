var DEFAULT_LEFT_IMAGE = "assets/Images/HD.png";
var DEFAULT_RIGHT_IMAGE = "assets/Images/jojo5.png";
var currentActiveIndex = -1;

function updateSideImages(index) {
    if (index === currentActiveIndex) return;
    currentActiveIndex = index;

    var allSideImages = document.querySelectorAll('.side-image');
    for (var i = 0; i < allSideImages.length; i++) {
        allSideImages[i].classList.remove('active');
    }

    var leftImages = document.querySelectorAll('#side-left .side-image');
    var rightImages = document.querySelectorAll('#side-right .side-image');

    if (leftImages[index]) leftImages[index].classList.add('active');
    if (rightImages[index]) rightImages[index].classList.add('active');
}

function handleScroll() {
    var scrollArea = document.getElementById('blog-scroll-area');
    var posts = document.querySelectorAll('.blog-post');
    if (!scrollArea || posts.length === 0) return;

    if (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 30) {
        updateSideImages(posts.length - 1);
        return;
    }

    if (scrollArea.scrollTop <= 10) {
        updateSideImages(0);
        return;
    }

    var scrollAreaRect = scrollArea.getBoundingClientRect();
    var scrollAreaCenter = scrollAreaRect.top + scrollAreaRect.height / 2;

    var closestIndex = 0;
    var minDistance = Infinity;

    for (var i = 0; i < posts.length; i++) {
        var rect = posts[i].getBoundingClientRect();
        var postCenter = rect.top + rect.height / 2;
        var distance = Math.abs(postCenter - scrollAreaCenter);

        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = parseInt(posts[i].getAttribute('data-index'), 10);
        }
    }

    updateSideImages(closestIndex);
}

function renderBlog() {
    var container = document.getElementById('blog-content');
    var sideLeft = document.getElementById('side-left');
    var sideRight = document.getElementById('side-right');

    if (!container) {
        console.error('Élément #blog-content introuvable');
        return;
    }

    if (!blogPosts || blogPosts.length === 0) {
        container.innerHTML = '<div class="blog-empty">Aucun article</div>';
        return;
    }

    var leftHtml = '';
    var rightHtml = '';

    for (var i = 0; i < blogPosts.length; i++) {
        var post = blogPosts[i];
        var leftSrc = post.imageLeft || DEFAULT_LEFT_IMAGE;
        var rightSrc = post.imageRight || DEFAULT_RIGHT_IMAGE;
        var activeClass = (i === 0) ? ' active' : '';

        leftHtml += '<img src="' + leftSrc + '" alt="Décoration gauche" class="side-image' + activeClass + '" data-post-index="' + i + '" />';
        rightHtml += '<img src="' + rightSrc + '" alt="Décoration droite" class="side-image' + activeClass + '" data-post-index="' + i + '" />';
    }

    if (sideLeft) sideLeft.innerHTML = leftHtml;
    if (sideRight) sideRight.innerHTML = rightHtml;

    var html = '';

    for (var i = 0; i < blogPosts.length; i++) {
        var post = blogPosts[i];
        var delay = i * 0.1;

        html += '<article class="blog-post" data-index="' + i + '" style="animation-delay: ' + delay + 's;">';
        html += '  <div class="blog-post-header">';
        html += '    <h2 class="blog-post-title">' + post.title + '</h2>';
        html += '    <div class="blog-post-meta">';
        html += '      <span class="blog-post-date"> ' + post.date + '</span>';

        if (post.category) {
            html += '        <span class="blog-post-category">' + post.category + '</span>';
        }

        html += '    </div>';
        html += '  </div>';
        html += '  <div class="blog-post-content">' + post.content + '</div>';
        html += '</article>';

        if (i < blogPosts.length - 1) {
            html += '<div class="blog-post-separator">· · ·</div>';
        }
    }

    html += '<div class="back-to-top-wrapper">';
    html += '  <button id="back-to-top-btn" type="button">↑ Retour en haut ↑</button>';
    html += '</div>';
    html += '<div class="blog-scroll-bottom-spacer"></div>';

    container.innerHTML = html;

    var topBtn = document.getElementById('back-to-top-btn');
    if (topBtn) {
        topBtn.addEventListener('click', function () {
            var scrollArea = document.getElementById('blog-scroll-area');
            if (scrollArea) {
                scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    currentActiveIndex = 0;

    var scrollArea = document.getElementById('blog-scroll-area');
    if (scrollArea) {
        scrollArea.addEventListener('scroll', handleScroll);
    }
}

document.addEventListener('DOMContentLoaded', renderBlog);
