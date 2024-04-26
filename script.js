const form = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        const newsContainer = document.getElementById('news-container');
        const drawer = document.getElementById('drawer');
        const stocks = document.getElementById('stock');
        document.addEventListener("DOMContentLoaded", function() {
    const fetchDataBtn = document.getElementById("fetchDataBtn");
    const symbolInput = document.getElementById("symbol");
    const dataContainer = document.getElementById("dataContainer");

    fetchDataBtn.addEventListener("click", function() {
        const symbol = symbolInput.value.trim();
        if (symbol !== "") {
            fetchStockData(symbol);
        } else {
            alert("Please enter a stock symbol.");
        }
    });

    function fetchStockData(symbol) {
        const apiKey = 'W9170UZM7ORVZJEZ';
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function displayData(data) {
        // Clear previous data
        dataContainer.innerHTML = '';

        const timeSeriesData = data['Time Series (1min)'];
        if (!timeSeriesData) {
            dataContainer.innerHTML = '<p>No data available for the given symbol.</p>';
            return;
        }

        const firstFiveMinutes = Object.entries(timeSeriesData).slice(0, 1);
        const ul = document.createElement('ul');

        firstFiveMinutes.forEach(entry => {
    const [time, values] = entry;
    const li = document.createElement('li');
    
    // Calculate profit/loss
    const open = parseFloat(values['1. open']);
    const close = parseFloat(values['4. close']);
    const profitLoss = close - open;
    const color = profitLoss >= 0 ? 'green' : 'red';
    
    // Create text content with colors
    li.innerHTML = `
        <span style="color: ${color};">Time: ${time}, Open: ${values['1. open']}, High: ${values['2. high']}, Low: ${values['3. low']}, Close: ${values['4. close']}, Volume: ${values['5. volume']}</span>
    `;
    
    ul.appendChild(li);
});


        dataContainer.appendChild(ul);
    }
});

        function menu() {
            if (drawer.style.display === 'block') {
                drawer.style.display = 'none';
                drawer.style.width = '0px';
            } else {
                drawer.style.display = 'block';
                drawer.style.width = '400px';
            }
        }

        function stockprice() {
            if (stocks.style.display === 'block') {
                stocks.style.display = 'none';
               
            } else {
                stocks.style.display = 'block';
           
            }
        }

        // Function to fetch news by category
        function fetchCategoryNews(category) {
            const apiUrl = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=2919d76cf469494d85494e200eb92a25`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    displayArticles(data.articles);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }

        // Function to display articles
        function displayArticles(articles) {
            newsContainer.innerHTML = ''; // Clear previous articles

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');

                const title = document.createElement('h2');
                const titleLink = document.createElement('a');
                titleLink.href = article.url; // Set link to the full article URL
                titleLink.textContent = article.title;
                title.appendChild(titleLink);

                const description = document.createElement('p');
                description.textContent = article.description;

                const image = document.createElement('img');
                image.src = article.urlToImage;
                image.alt = article.title;

                articleDiv.appendChild(title);
                articleDiv.appendChild(description);
                articleDiv.appendChild(image);

                newsContainer.appendChild(articleDiv);
            });
        }

        // Event listener for form submission
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== '') {
                const apiUrl = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=2919d76cf469494d85494e200eb92a25`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        displayArticles(data.articles);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            }
        });

        // Fetch top headlines when the page loads
        fetchCategoryNews('general');