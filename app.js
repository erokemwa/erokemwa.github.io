(function () {
    // Existing functionality for control buttons
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });

    // Existing functionality for theme switching
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });

    // New functionality to fetch and display Medium blog posts

    // Function to fetch Medium posts
    function fetchMediumPosts() {
        // Assuming your Medium RSS feed URL
        const rssUrl = 'https://medium.com/@erokemwa/feed';

        // Fetch RSS feed
        fetch(rssUrl)
            .then(response => response.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(data => {
                const items = data.querySelectorAll("item");
                const blogContainer = document.querySelector("#blogs .blogs"); // Adjusted to select the correct container

                // Clear previous content if any
                blogContainer.innerHTML = '';

                items.forEach(item => {
                    let title = item.querySelector("title").textContent;
                    let content = item.querySelector("content\\:encoded").textContent;

                    // Extract image from content (very rough, might need refining)
                    let imgMatch = content.match(/<img.*?src="(.*?)"/);
                    let imgSrc = imgMatch ? imgMatch[1] : '';
                    let summary = content.replace(/<[^>]+>/g, '').substring(0, 200) + "...";

                    // Create blog post structure
                    let blogPost = document.createElement('div');
                    blogPost.className = 'blog';

                    let img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = '';  // You should set a meaningful alt text

                    let blogText = document.createElement('div');
                    blogText.className = 'blog-text';

                    let h4 = document.createElement('h4');
                    h4.textContent = title;

                    let p = document.createElement('p');
                    p.textContent = summary;

                    blogText.appendChild(h4);
                    blogText.appendChild(p);
                    blogPost.appendChild(img);
                    blogPost.appendChild(blogText);

                    blogContainer.appendChild(blogPost);
                });
            })
            .catch(error => console.error('Error fetching Medium posts:', error));
    }

    // Call the function to fetch posts when needed, e.g., on page load
    fetchMediumPosts();

    // Optionally, if you want to refresh the blogs at some interval:
    // setInterval(fetchMediumPosts, 60000); // Refresh every 60 seconds

})();
