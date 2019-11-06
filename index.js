const app = require("express")();
const server = require("http").Server(app);
const rp = require("request-promise-native");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const port = 3000;

const heroes = {
  Superman: "644",
  Sylar: "647",
  IronMan: "346",
  Wolverine: "717",
  WonderWoman: "720",
  SpiderMan: "620",
  JamesBond: "352",
  LukeSkywalker: "418",
  Mystique: "480",
  Rogue: "567"
};

async function getHeros() {
  let results = [];
//   API Call
  for (let key of Object.values(heroes)) {
    let heroesResponse = await rp({
      url: `https://www.superheroapi.com/api.php/10160087393246509/${key}`,
      json: true
    });
// Push response
    results.push({
      heroName: heroesResponse.name,
      intelligence: parseInt(heroesResponse.powerstats.intelligence),
      allPowers: parseStringToInt(heroesResponse.powerstats)
    });
}

let csvLines = [];
  let sortedByIntelligenceName = [];
  let sortedByIntelligenceScore = [];
  let sortedByOverallPowerName = [];
  let sortedByOverallPowerScore = [];

// Sort by intelligence
  for (let i = 0; i < results.length; i++) {
      let sortByInt = results.sort(
          (a, b) => parseFloat(b.intelligence) - parseFloat(a.intelligence)
          );
          sortedByIntelligenceName.push(sortByInt[i].heroName);
          sortedByIntelligenceScore.push(sortByInt[i].intelligence);
        }

//Sort by overall power   
    for (let i = 0; i < results.length; i++) {
        let sortByPower = results.sort(
          (a, b) => parseFloat(b.allPowers) - parseFloat(a.allPowers)
        );
        sortedByOverallPowerName.push(sortByPower[i].heroName);
        sortedByOverallPowerScore.push(sortByPower[i].allPowers);
    }

    csvLines.push({
        row: (sortedByIntelligenceName),
          }, {
            row: (sortedByIntelligenceScore),
          },{
            row: (sortedByOverallPowerName),
          }, {
            row: (sortedByOverallPowerScore)
    });


// Create CSV file
  const csvWriter = createCsvWriter({
      path: 'Heroes.csv',
      header: [{id: 'row', title: 'row'}]
});
    
csvWriter
      .writeRecords(csvLines)
      .then(()=> console.log('The CSV file was written successfully'));
}

// Sum and parse all powers
function parseStringToInt(powers) {
  let totalPower = [];
  for (const [key, value] of Object.entries(powers)) {
    totalPower.push(parseInt(value, 10));
  }
  return totalPower.reduce((a, b) => a + b, 0);
}

getHeros();

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
