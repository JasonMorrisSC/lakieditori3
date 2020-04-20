import {useEffect, useState} from "react";
import axios from "axios";

export function useLemma(word: string) {
  const [lemma, setLemma] = useState(word);

  useEffect(() => {
    axios.get('/api/lemma', {
      params: {word},
      responseType: 'text'
    }).then(res => {
      setLemma(res.data ? res.data : word);
    });
  }, [word]);

  return {lemma};
}