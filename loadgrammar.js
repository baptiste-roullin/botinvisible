var tracery = require('./tracery.js'),
    rawGrammar = require('./grammar.json'), // the grammar for the bot, edit this!
    processedGrammar = tracery.createGrammar(rawGrammar),
  baseEngModifiers = require('./mods-eng-basic.js');
  processedGrammar.addModifiers(baseEngModifiers); 

module.exports.grammar = processedGrammar;