export default class Statements {
   source: string[];
   constructor(src: string) {
      if (src.length < 1 || src === undefined)
         throw Error('ERROR: Statements.constructor: source invalid\n\n');
      this.source =
         src.toLowerCase()
            .replace(/, /g, ',')
            .replace('. ',  '.')
            .replace(/\n/g, ' ')
            .split('.')
            .filter(each => each.length > 0 && each !== ' ');
   }

   getStatements = () => this.source;

   getSentences = (str: string[]|undefined) =>
      !str ? this.source.map(each => each.split(','))
           : str.map(each => each.split(','));

   encodeExpressions = (str: string) =>
      str.replace(/ tai | taikka |,tai |,taikka /g,
                  ' OR ')
         .replace(/ jos | mikäli |jos |,jos |mikäli |,mikäli /g,
                  ' IF ')
         .replace(/ ja | sekä |,sekä /g,
                  ' AND ')
         .replace(/ muuten |,muuten /g,
                  ' ELSE ')
         .replace(/ enemmän kuin /g,
                  ' MORETHAN ')
         .replace(/ vähemmän kuin /g,
                  ' LESSTHAN ')
         .replace(/ enintään | enintään| viimeisintään | viimeisintään| viimeistään | viimeistään/g,
                  ' ATMOST ')
         .replace(/ aikaisintaan | aikaisintaan| vähintään | vähintään/g,
                  ' ATLEAST ')
         .replace(/ prosenttia | prosenttia/g,
                  ' @MATH.PERCENT ')
         .replace(/ euroa | euroa/g,
                  ' @CURRENCY.EUR ')
         .replace(/ metriä | metriä| kilometriä | kilometriä/g,
                  ' @MEASURE.LEN ')
         .replace(/ neliömetriä | neliömetriä| neliökilometriä | neliökilometriä/g,
                  ' @MEASURE.AREA ')
         .replace(/[äå]/g, 'a')
         .replace(/ö/g, 'o')

   sentenceIsConditional = (sentence: string) =>
      sentence.indexOf('IF') === 0 ? true : false;

   wordMatch = (word: string, comparisons: string[]) =>
      comparisons.filter(comparison => word === comparison).length > 0
         ? true
         : false;

   buildStatement = (sentence: string) => {
      const comparisons = ['MORETHAN', 'LESSTHAN', 'ATMOST', 'ATLEAST'];
      const words = sentence.trim().split(' ');
      let statementWords: string[] = [];

      words.forEach((word, index) => {
         if (word === 'on' && this.wordMatch(words[index + 1], comparisons))
            statementWords.push('EQUALS');
         else
            statementWords.push(word);
      });

      return statementWords.join(' ');
   }

   buildStructure = () => {
      const structure: object[] = [];
      const statements = this.getSentences(
         this.source.map(each =>
            this.encodeExpressions(each)
         )
      );

      statements.forEach(sentences => {
         const stObj = {
            statement: '',
            conditions: ''
         }
         let mainSentenceLast = false;
         sentences.forEach((sentence, index) => {
            index < 1 && this.sentenceIsConditional(sentence)
               ? mainSentenceLast = true
               : stObj.statement = this.buildStatement(sentence);

            index < sentences.length + 1
               ? stObj.conditions += this.buildStatement(sentence)
               : (mainSentenceLast
                  ? stObj.statement = this.buildStatement(sentence)
                  : stObj.conditions += this.buildStatement(sentence)
               );
            }
         )
         structure.push(stObj);
      });

      return structure;
   }
}