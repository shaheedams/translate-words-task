let wordsArray;
let dictionary;

// CONVERT CSV FILE INTO ARRAY OF OBJECT FUNCTION
function csvConverter(str) {
  const headers = str.slice(0, str.indexOf("\n")).split(",");
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    let obj = {};
    
  const arr = rows.map(function (row) {
    const values = row.split(",");
    obj[values[0]] = { ans: values[1] };
  });
    
  return obj;
}

// CONVERT ARRAY OF OBJECT INTO CSV FILE  FUNCTION
function csvFileConverter(result) {
     const titleKeys = ["English Word", "French word", "Frequency"];
    const refinedData = [];
     refinedData.push(titleKeys);

     Object.values(result).forEach((item) => {
       refinedData.push(Object.values(item));
     });

     let csvContent = "";

     refinedData.forEach((row) => {
       csvContent += row.join(",") + "\n";
     });
    
    return csvContent;
}

// TO FETCH FIND WORDS AND DICTIONARY WORDS
fetch("src/find_words.txt")
  .then((response) => response.text())
  .then((text) => {
    let words = text.replace(/\n/g, " ");
    wordsArray = words.split(" ");
});

fetch("src/french_dictionary.csv")
.then((response) => response.text())
    .then((text) => {
    dictionary = csvConverter(text);
});
    
// FUNCTION TO READ INPUT FILE
const readInput = (input) => {
  let file = input.files[0];

  let reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function () {
    var data = reader.result;

    var dataArray = data.split(" ");
    let result = {};
      
    dataArray.map((word) => {
      if (wordsArray.includes(word)) {
        if (!result[word]) {
          result[word] = {
            englishWord: word,
            frenchWord: dictionary[word] ? dictionary[word].ans : word,
            count: 0
          };
            data = data.replaceAll(word, result[word].frenchWord);
        } else {
          result[word].count += 1;
        }
      }
    });
    

    let csvContent = csvFileConverter(result);
    // TO DOWNLOAD CSV AND TEXT FILE OUTPUT
    const csvFile = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
    const csvfileUrl = URL.createObjectURL(csvFile);
    const links = document.createElement("a");
    links.download = "frequency.csv";
    links.href = csvfileUrl;
    links.click();

    const textFile = new Blob([data], { type: "text/plain;charset=utf-8" });
    const textfileUrl = URL.createObjectURL(textFile);
    const link = document.createElement("a");
    link.download = "t8_shakespeare_translated.txt";
    link.href = textfileUrl;
    link.click();
      
  };
};
