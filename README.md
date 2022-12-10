# All The Cards - Frontend

![All The Cards](atc-logo.png)

## Introduction

We present to you, yet another Magic: The Gathering online library. All The Cards allows users to explore, create, and share decks, custom cards, and favorites. This repo is specific to the frontend for handling user interactions and sending data to the server.

![All The Cards](homepage.png)

## Features

### Deck Editor:
#### `Persistent Deck Editor`
Unlike traditional deck builders, our deck editor follows you around the site, so you can browse without losing your work. Search for cards and view other decklists to get inspiration and add cards with a click
#### `Customization`
Personalize your decklist by selecting a cover card, tags, and description
#### `Import`
Import a decklist in the deck editor in the format `4 Lightning Bolt` or `4 Lightning Bolt [M11]`


### Homepage:
#### `Recent Decks`
Showcase of recent user-submitted decklists
#### `Search Bar`
Search for any card by name, or click the 'advanced' search button for more detailed queries


### User Accounts:
#### `Search`
Find users by searching for a username, then navigate to the 'Users' section in the search results
#### `Profile`
View a user's profile information, uploaded decks, and favorites
#### `Avatars`
Set any card's artwork as your profile avatar from the card page


### Deck Page:
#### `Tiles`
Click on a 'deck tile' to be directed to that deck's page. These are visible on the home screen, user profile pages, and search results
#### `Information`
View the description, tags, format, price, and other details about a deck
#### `List`
View all of the cards in a deck. Hover to see price information and card image
#### `Breakdown`
Displays statistics about a deck, such as mana curve, color distribution, and card types
#### `Export`
Export a decklist as a download or text copy to use anywhere


### Card Search:
#### `Search`
Look up any card by name
#### `Advanced Search`
Use the advanced search fields to create a custom search query
#### `Filters`
Refine search results using the filters


### Card Page:
#### `Details`
View a card's name, stats, legalities, and other details
#### `Version Select`
Choose from a list of all printings of a card
#### `Pricing`
See a card's price on TCGPlayer or CardHoarder

## Technologies

This project is coded in JavaScript, using [React.js](https://reactjs.org/). The catalog of data is courtesy of [Scryfall API](https://scryfall.com/docs/api).

## Installation

To run this project, you will need to have [NodeJS](https://nodejs.org/en/) installed on your system. Unzip the folder, open PowerShell or Bash in that folder, and run `npm install`. Then you can run `npm start` to run the client.

## Development Setup

The URL is [http://localhost:3000](http://localhost:3000) for the client.

## License

All The Cards is unofficial Fan Content permitted under the [Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy). This project is not sponsered/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.

## Contributors

`Frontend` Tanner Hawkins\
`Frontend` Michael Lanctot\
`Backend` Jamier Singleton\
`Frontend` Noah Stephenson

## Project Status

`Pre-Alpha` Stage Development.
