// Create NewsAPI object with API key
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('f88adea34f584c2ba358c1ce0783eb78');

// Create empty array for storing URLs
let urlArray = [];

// Fetch data with News API
function getNews(Company) {
    let newsArticles = newsapi.v2.everything({
        qinTitle: '+' + Company,
        q: '+' + Company,
        sortBy: 'relevancy',
        language: 'en'
    }).then(response => {
        for (let i = 0; i < response.articles.length; i++)
        {
            // Push URL strings onto array 
            urlArray.push(response.articles[i].url);
        }
        //console.log(urlArray);
        return urlArray;
    }).catch(() => {
        console.log("An error has occured while getting news links");
        return [];
    });
}

module.exports = {
    getNews: getNews
  };
