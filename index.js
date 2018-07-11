const Letter = require('./Letter.js');
const Word = require('./Word.js');
const inquirer = require('inquirer');
const ud = require('urban-dictionary')


function displayGameHeaderWith(definition) {
    console.log(
        `
-------------------------------------------------------------------------------
In this game you will guess an "urban" word based on the definition provided.
Good luck!!!!!

Definition: ${definition}
        `)
};

function getLetter() {
    return new Promise((resolve, reject) => {
        return inquirer
            .prompt([
                {
                    name: "guessLetter",
                    message: "Guess a letter!"
                }
            ])
            .then(function (answer) {
                resolve(answer.guessLetter);
            });
    });
};

function getUrbanWord() {
    return new Promise((resolve, reject) => {
        return ud.random(function (error, entry) {
            if (error) {
                reject(error.message);
            } else {
                resolve(entry);
            };
        });
    });
};

function getLetterInputAndUpdateWord(urbanWord) {
    const correctGuessCount = urbanWord.letterObjectArray.map(element => element.isGuessed).filter(element => element === true).length
    if(correctGuessCount < urbanWord.letterArray.length){
        getLetter()
            .then((answer) => {
                const letterInput = answer.toLowerCase();
                urbanWord.checkAllLetter(letterInput);
                if (urbanWord.letterArray.includes(letterInput)) {
                    console.log('Correct!!!');
                }
                else console.log('Incorrect!!!');
                urbanWord.displayWord();
                getLetterInputAndUpdateWord(urbanWord);
            })
            .catch((err) => console.error(err));
    } else console.log('Congrats!')
}

function playGame() {
    let urbanWord = {}, definition = '', example = '';
    return getUrbanWord()
        .then((entry) => {

            urbanWord = new Word(entry.word.toLowerCase());
            console.log(urbanWord.word);
            let re = /`${urbanWord.word}`/gi;
            definition = entry.definition.replace(urbanWord.word,'[]');
            console
            example = entry.example;

            displayGameHeaderWith(definition);
            urbanWord.displayWord();
            getLetterInputAndUpdateWord(urbanWord);

        })
        .catch((err) => console.error(err));
};
playGame();