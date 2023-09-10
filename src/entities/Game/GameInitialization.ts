import { Game } from "./Game";
import { GameScore } from "./GameScore";
import { Logger } from "../Logger/Logger";
import { Player } from "../Player/Player";
import { PokerDeck } from "../PokerDeck/PokerDeck";
import { Card } from "../PokerDeck/Card";
import { loadConfigFile } from "./auxiliary/loadConfig";
import { setCardsToDealAndNumberOfDecks, setOption } from "./auxiliary/setGameOptions";
import { GameOptions, GameConfig } from "./auxiliary/extraTypes.js";


/** Utility methods for initializing a Game. */
export class GameInitialization{

    /** The GameOptions that were passed into the Game. */
    gameOptions: GameOptions;


    constructor(gameOptions: GameOptions){
        this.gameOptions = gameOptions;
    }


    /** 
     * Checks each gameOptions option if its undefined/valid; if so, corrects/sets it in-place using the variant config.
     * Variants with their own options should override this, then super it.
    */

    //TO DO: limit numerical options so that they make sense within context of a Rummy game (ie, cant draw >52*numDecks cards etc)
    initializeOptions(title: string, numPlayers: number){
        let gameConfig = this.loadConfig(title);

        this.gameOptions.useWildcard = setOption(gameConfig, this.gameOptions.useWildcard, "useWildcard") as boolean;
        this.gameOptions.useJoker = setOption(gameConfig, this.gameOptions.useJoker, "useJoker") as boolean;
        if (this.gameOptions.useJoker && this.gameOptions.useWildcard) this.gameOptions.useWildcard = false;
        this.gameOptions.cardsToDraw = setOption(gameConfig, this.gameOptions.cardsToDraw, "cardsToDraw") as number;
        this.gameOptions.cardsToDrawDiscardPile = setOption(gameConfig, this.gameOptions.cardsToDrawDiscardPile, "cardsToDrawDiscardPile") as number|"all";

        [this.gameOptions.cardsToDeal, this.gameOptions.numberOfDecks] 
        = setCardsToDealAndNumberOfDecks(
            gameConfig, 
            numPlayers, 
            this.gameOptions.cardsToDeal, 
            this.gameOptions.numberOfDecks);
    }


    /** 
     * Loads a json config file for the game (must be located in same directory, and named same as the class 'title' property.
     * Variants with their own config objects should override this with the appropriate config type.
     */
    loadConfig(title: string){
        return loadConfigFile<GameConfig>(__dirname, title);
    }   


    /** Initializes a logger. */
    initializeLogger(game: Game){
        return new Logger(game);
    }


    /** Initializes an array of player objects. */
    initializePlayers(game: Game, playerIds: string[]){
        let players = [];
        for (const playerId of playerIds){
            players.push(new Player(game, playerId));
        }
        return players;
    }


    /** Initializes a score object which is used for tracking/calculating score for current round. */
    initializeScore(game: Game){
        return new GameScore(game);
    }


    /** Initializes deck, joker (printed/wildcard/none, depending on game configuration), and a copy of the deck for validation later. */
    initializeDeckJokerAndValidationCards(): [PokerDeck, keyof typeof PokerDeck.numbers|false, Card[]]{
        let deck = new PokerDeck(this.gameOptions.numberOfDecks, this.gameOptions.useJoker);
        let validationCards = deck.getCards().slice().sort(Card.compareCardsSuitFirst);
        deck.shuffle();
        
        //wildcard number = (currentRound+1)%(size of deck numbers)
        let jokerNumber: keyof typeof deck.numbers|false;
        if (this.gameOptions.useJoker) jokerNumber = 'Joker';
        else if (this.gameOptions.useWildcard) jokerNumber = deck.numbers[0] as keyof typeof PokerDeck.numbers;
        else jokerNumber = false;

        return [deck, jokerNumber, validationCards];
    }
}