import { Game } from "../Game/Game";
import { Player } from "../Player/Player";


/** 
 * Used for tracking and calculating a game's score.
 * Scores are evaluated only at the end of every round.
 * Scores are evaluated for all players in `this.game.players`, even if they have (just) quit.
*/
export class GameScore{
    /// Properties ///


    /** The Game that is being tracked. */
    game: Game;
    /** The scores. Each round holds an array of (player, score) tuples. */
    scores: {[round: number]: [Player, number][]};


    /// Methods ///


    /**
     * Creates a GameScore. Initializes scores to -1.
     * @constructor
     */
    constructor(game: Game){
        this.game = game;
        this.scores = {};
    }


    /**
     * Evaluates the current round's score.
     * Calls evaluatePlayerScore for each (currently playing) player.
     */
    evaluateRoundScore(){
        if (this.scores[this.game.currentRound]==undefined) this.scores[this.game.currentRound] = [];
        for (const player of this.game.players){
            let score = this.evaluatePlayerScore(player);
            this.scores[this.game.currentRound].push([player, score]);
        }
    }


    /**
     * Evaluates a single player's score.
     * Variants with different scoring systems should override this.
     */
    private evaluatePlayerScore(player: Player): number{
        let score = 0;
        if (player.hand){
            score = player.hand.reduce((prevVal, card) => prevVal+card.cardNumberValue(), score);
        }
        return score;
    }
}
