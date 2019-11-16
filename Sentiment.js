const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: 'b7DmXMCT1_r3V_opK1VSBILGDp0dcNoc9pT4nxAy8O0F',
  }),
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api',
});
var result = [];

/**
   * Private function that gets the sentimate value from -1 to 1
   * @param inURL - url of news story
   * @param companyName - name of company
   * @returns none
   */
function doCalc(inURL, companyName){
  console.log('The second one');

  const analyzeParams = {
    'url': inURL,
    'features': {
      'sentiment': {
        'targets': [
          companyName
        ]
      }
    }
  };
  naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
      result.push(analysisResults.result.sentiment.targets[0].label);
      result.push(analysisResults.result.sentiment.targets[0].score);
      //console.log(JSON.stringify(analysisResults, null, 2));
      
    })
    .catch(err => {
      console.log('error:', err);
    });
  
}

/**
   * Wrapper of doCalc()
   * @param URL - url of news story
   * @param Company - name of company
   * @returns none
   */
function getSentiment(URL, Company){
  const analyzeParams = {
    'url': URL,
    'features': {
      'sentiment': {
        'targets': [
          Company
        ]
      }
    }
  };
    
  return naturalLanguageUnderstanding.analyze(analyzeParams)
    
  
}
module.exports = {
  getSentiment: getSentiment
};

//getSentiment('https://www.breitbart.com/clips/2019/11/03/trump-i-think-nancy-pelosi-has-lost-her-mind/', 'Nancy');

