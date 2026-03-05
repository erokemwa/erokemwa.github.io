(function () {
    // Existing functionality for control buttons
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn")?.classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active")?.classList.remove("active");
            document.getElementById(button.dataset.id)?.classList.add("active");
        });
    });

    // Existing functionality for theme switching
    document.querySelector(".theme-btn")?.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });

    // New functionality to fetch and display Medium blog posts

    // Function to fetch Medium posts
    async function fetchMediumPosts() {
        const blogContainer = document.querySelector("#blogs .blogs");
        if (!blogContainer) return;

        const mediumUser = 'erokemwa';
        const rssUrl = `https://medium.com/@${mediumUser}/feed`;

        // Show a loading message while fetching
        blogContainer.innerHTML = '<p class="loading-msg">Loading posts&hellip;</p>';

        try {
            const response = await fetch(rssUrl);
            const str = await response.text();
            const data = new window.DOMParser().parseFromString(str, "text/xml");
            const items = data.querySelectorAll("item");

            // Clear loading message
            blogContainer.innerHTML = '';

            if (!items.length) {
                blogContainer.innerHTML = '<p class="blogs-msg">No posts found.</p>';
                return;
            }

            items.forEach(item => {
                const title = item.querySelector("title")?.textContent || '';
                const link = item.querySelector("link")?.textContent?.trim() || '#';

                // Prefer content:encoded, fall back to description
                const contentEl = item.querySelector("content\\:encoded") || item.querySelector("description");
                const content = contentEl ? contentEl.textContent : '';

                // Extract image from content if present
                const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
                const imgSrc = imgMatch ? imgMatch[1] : null;

                // Safely extract plain text from HTML content
                const tmpDoc = new window.DOMParser().parseFromString(content, 'text/html');
                const plainText = tmpDoc.body ? tmpDoc.body.textContent : '';
                const summary = plainText.length > 200
                    ? plainText.substring(0, 200) + '\u2026'
                    : plainText;

                // Create blog post structure wrapped in a link
                const anchor = document.createElement('a');
                anchor.href = link;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
                anchor.className = 'blog';

                if (imgSrc) {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = title;
                    anchor.appendChild(img);
                }

                const blogText = document.createElement('div');
                blogText.className = 'blog-text';

                const h4 = document.createElement('h4');
                h4.textContent = title;

                const p = document.createElement('p');
                p.textContent = summary;

                blogText.appendChild(h4);
                blogText.appendChild(p);
                anchor.appendChild(blogText);

                blogContainer.appendChild(anchor);
            });
        } catch (error) {
            console.error('Error fetching Medium posts:', error);
            blogContainer.innerHTML = `<p class="blogs-msg">Could not load posts (likely a CORS issue). Please visit <a href="https://medium.com/@${mediumUser}" target="_blank" rel="noopener noreferrer">Medium</a> directly.</p>`;
        }
    }

    // Call the function to fetch posts when needed, e.g., on page load
    fetchMediumPosts();

    // Optionally, if you want to refresh the blogs at some interval:
    // setInterval(fetchMediumPosts, 60000); // Refresh every 60 seconds

})();
