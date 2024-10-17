async function fetchArticles( query ) {
    return await fetch(
        `https://api.bing.microsoft.com/v7.0/news/search?q=${query}`
    ).then((resp) => resp.json())
        .then((data) => console.log(data))
}

fetchArticles("neodymium")