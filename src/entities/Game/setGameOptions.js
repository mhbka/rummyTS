/*
Functions here are used for setting/verifying config options.
Most work like so:
    -Accepts a config object and the intended option
    -If option wasn't specified, set it to the config default
    -If the config doesn't specify any value/a useable value for that option, set it to a hardcoded value
    -Return the option

Some functions, eg setCardsToDrawAndNumberOfDecks, may have additional logic to ensure the specified options are feasible etc.
*/


//Returns useWildcard option.
export function setWildcardOption(_config, useJoker){
    let setUseJoker;
    if (useJoker===undefined){
        if (_config.useJoker!==false || _config.useJoker!==true) setUseJoker = true;
        else setUseJoker = _config.useJoker;
    }
    else setUseJoker = useJoker;
    return setUseJoker;
}

//Returns useJoker option.
export function setJokerOption(_config, useWildcard){
    let setUseWildcard;
    if (useWildcard===undefined){
        if (_config.useWildcard!==false || _config.useWildcard!==true) setUseWildcard = true;
        else setUseWildcard = _config.useWildcard;
    }
    else setUseWildcard = useWildcard;
    return setUseWildcard;
}

//Returns cardsToDrawDiscardPile option.
export function setCardsToDrawDiscardPile(_config, cardsToDrawDiscardPile){
    let setCardsToDrawDiscardPile;
    if (cardsToDrawDiscardPile===undefined){
        if (!_config.cardsToDrawDiscardPile) setCardsToDrawDiscardPile = 1;
        else setCardsToDrawDiscardPile = _config.useWildcard;
    }
    else setCardsToDrawDiscardPile = cardsToDrawDiscardPile;
    return setCardsToDrawDiscardPile;
}


/*
Returns cardsToDraw and numberOfDecks options.
Also checks to see if total cards drawn exceeds the total deck size; if so, overrides the specified options.
Also checks other numberOfDecks, if given one doesn't specify a cardsToDraw in the config.
*/
export function setCardsToDrawAndNumberOfDecks(_config, playersSize, cardsToDraw, numberOfDecks){
    let setCardsToDraw, setNumberOfDecks;

    //if specified values are valid, return them; else, override with config values.
    if (cardsToDraw!==0 && playersSize*cardsToDraw < numberOfDecks*52){
        return [cardsToDraw, numberOfDecks];
    }

    //if no cardsToDraw found for the given numberOfDecks, or for given playersSize,
    //then loop through other numberOfDecks for a valid cardsToDraw for the given playersSize.
    let cardsToDrawRules = _config.cardsToDraw.decks;
    if (!cardsToDrawRules[numberOfDecks] || !cardsToDrawRules[numberOfDecks].players[playersSize]){
        for (const deckNo in cardsToDrawRules[numberOfDecks]){
            let cardsToDraw = cardsToDrawRules[deckNo].players[playersSize];
            if (cardsToDraw){
                setCardsToDraw = cardsToDraw;
                setNumberOfDecks = deckNo;
            }
        }
        //if nothing found at all for playersSize, throw an error
        throw new Error('No amount of cards can be dealt for the amount of players given.');
    }

    //if cardsToDraw exists for given numberOfDecks and playersSize, return it
    else{
        setCardsToDraw = cardsToDrawRules[numberOfDecks].players[playersSize];
        setNumberOfDecks = numberOfDecks;
    }
    return [setCardsToDraw, setNumberOfDecks];
}

