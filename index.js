/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*******************************************************************************/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 
 * Bonus Challenge: Create a search bar for easier game search and access
******************************************************************************/

// Grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// Create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // Clear the games container before adding new games
    gamesContainer.innerHTML = '';

    // Check if there are no games to display
    if (games.length === 0) {
        document.getElementById("error-message").style.display = "block";
        return;
    }

    // Hide the error message if games are found
    document.getElementById("error-message").style.display = "none";

    // Loop over each item in the data
    games.forEach(game => {
        // Create a new div element, which will become the game card
        const gameCard = document.createElement('div');

        // Add the class game-card to the list
        gameCard.classList.add('game-card');

        // Set the inner HTML using a template literal to display some info about each game
        gameCard.innerHTML = `
            <img src="${game.img}" alt="${game.name}" class="game-img" />
            <h2>${game.name}</h2>
            <p>${game.description}</p>
        `;

        // Append the game to the games-container
        gamesContainer.appendChild(gameCard);
    });
}

// Function to filter games based on the search query
function filterGames(query) {
    // Filter games based on the name (case-insensitive)
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(query.toLowerCase()));

    // Display the filtered games
    addGamesToPage(filteredGames);
}

// Listen for input in the search bar and filter games as the user types
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("input", () => {
    const query = searchBar.value.trim();
    filterGames(query);
});

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
**************************************************************************************/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to calculate the total number of individual contributions
const totalContributions = GAMES_JSON.reduce((acc, game) => acc + game.backers, 0);

// update the contributionsCard element to display the total number of contributions
// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.textContent = totalContributions.toLocaleString();



// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);

// set inner HTML using template literal
raisedCard.textContent = '$' + totalRaised.toLocaleString();



// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.reduce((acc, game) => acc + 1, 0);

gamesCard.textContent = totalGames.toLocaleString();


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
**************************************************************************************/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    // Clear existing game elements from the container
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}


// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames)
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON)
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", () => {
    filterUnfundedOnly();
});

fundedBtn.addEventListener("click", () => {
    filterFundedOnly();
});

allBtn.addEventListener("click", () => {
    showAllGames();
});


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
**************************************************************************************/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// Use reduce to calculate the total amount of money raised
const totalRaisedCount = GAMES_JSON.reduce((sum, game) => sum + game.pledged, 0);

// Create a string that explains the number of unfunded games using the ternary operator
const unfundedGamesMessage = `
    A total of $${totalRaisedCount.toLocaleString()} has been raised for ${GAMES_JSON.length} games.
    Currently, ${unfundedGamesCount} game${unfundedGamesCount === 1 ? '' : 's'} remain unfunded. 
    We need your help to fund ${unfundedGamesCount === 1 ? 'this amazing game🚀' : 'these amazing games'}!!!
`;

// Create a new DOM element
const descriptionElement = document.createElement("p");

// Set the innerHTML of the new element to the template string
descriptionElement.innerHTML = unfundedGamesMessage;

// Append the new element to the description container
descriptionContainer.appendChild(descriptionElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 **************************************************************************************/

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

// Sort the games by the pledged amount in descending order
const sortedGames = GAMES_JSON.sort((item1, item2) => item2.pledged - item1.pledged);

// Use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...remainingGames] = sortedGames;

// Create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameNameElement = document.createElement("h3");
topGameNameElement.textContent = `${firstGame.name}`;
firstGameContainer.appendChild(topGameNameElement);

// Do the same for the runner-up item
const secondGameNameElement = document.createElement("h3");
secondGameNameElement.textContent = `${secondGame.name}`;
secondGameContainer.appendChild(secondGameNameElement);

