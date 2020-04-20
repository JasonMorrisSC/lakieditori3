import {useEffect, useState} from "react";
import axios from "axios";
import {queryFirstText} from "../../../../utils/xmlUtils";

export interface Concept {
  uri: string,
  label: string,
}

export function useTextConcepts(text: string, extract: boolean) {
  const [concepts, setConcepts] = useState<Map<string, Concept>>(new Map());
  const [wordIsConceptCache, setWordIsConceptCache] = useState<Map<string, null | Concept>>(new Map());

  useEffect(() => {
    if (!extract) {
      return;
    }

    const words: string[] = text.split(/[\s.,!?(){}#]/);

    const hasConceptMatch = (word: string): Promise<null | Concept> => {
      return axios.get('/api/lemma', {
        params: {word: word.toLowerCase(), tag: 'N'},
        responseType: 'text'
      }).then(res => {
        return axios.get('/api/concepts', {
          params: {query: res.data},
          responseType: 'document'
        });
      }).then(res => {
        const resultConcepts = res.data.documentElement;
        return resultConcepts.childElementCount > 0 ? {
          uri: queryFirstText(resultConcepts, "/concepts/concept/@uri"),
          label: queryFirstText(resultConcepts, "/concepts/concept/label"),
        } : null;
      });
    };

    const hasConceptMatchCached = (word: string): Promise<null | Concept> => {
      if (wordIsConceptCache.has(word)) {
        return Promise.resolve(wordIsConceptCache.get(word) || null);
      } else {
        return hasConceptMatch(word).then(match => {
          setWordIsConceptCache(prevCache => new Map(prevCache).set(word, match));
          return match;
        });
      }
    };

    const timer = setTimeout(() => {
      words.forEach(word => {
        hasConceptMatchCached(word).then(match => {
          if (match) {
            setConcepts(prevConcepts => new Map(prevConcepts).set(word, match));
          }
        });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [text, extract, wordIsConceptCache]);

  return {concepts};
}
