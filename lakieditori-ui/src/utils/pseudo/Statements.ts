export default class Statements {
   source: string[];

   constructor(src: string) {
      if (src.length < 1 || src === undefined)
         throw 'ERROR: Statements.constructor: source invalid\n\n';
      this.source =
         src.toLowerCase()
            .replace(/, /g, ' , ')
            .replace('. ',  ' . ')
            .replace(/\n/g, '')
            .split('.')
            .filter(each => each.length > 0 && each !== ' ');
   }

   getStatements = () => this.source;

   getSentences = (str: string[]|undefined) =>
      !str ? this.source.map(each => each.split(' , '))
           : str.map(each => each.split(' , '));

   getExpressionsBySentence = (sentence: string[]) =>
      sentence.map(each => each.split(' '));

   getWordsByExpression = (expressions: string[]) => {
      expressions.map(each => (each).split(' '));
   }

   encodeExpressions = (str: string) =>
      str.replace(/ tai | taikka /g,                           ' OR ')
         .replace(/ jos | mikäli |jos |mikäli /g,              ' IF ')
         .replace(/ ja | sekä /g,                              ' AND ')
         .replace(/ muuten | muutoin /g,                       ' ELSE ')
         .replace(/ enemmän kuin /g,                           ' > ')
         .replace(/ vähemmän kuin /g,                          ' < ')
         .replace(/ enintään | viimeisintään | viimeistään /g, ' <= ')
         .replace(/ aikaisintaan | vähintään /g,               ' >= ')
         .replace(/ prosenttia /g,                             ' % ')

   getStructure = () =>
      this.getSentences(
         this.source.map(each =>
            this.encodeExpressions(each)
         )
      );
}