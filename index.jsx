
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Tesseract from 'tesseract.js';

function App() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [score, setScore] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [tags, setTags] = useState([]);

  const weights = {
    '속도': 1.5,
    '치명확률': 1.2,
    '치명 피해': 1.2,
    '공격력': 1.0,
    '체력': 0.8,
    '방어력': 0.7,
    '효과 적중': 0.5,
    '효과 저항': 0.5
  };

  const calculateScore = (extractedText) => {
    let total = 0;
    let foundTags = [];
    for (let key in weights) {
      const regex = new RegExp(key + '\s*([0-9]+)%?');
      const match = extractedText.match(regex);
      if (match) {
        const value = parseInt(match[1]);
        total += value * weights[key];
        foundTags.push(key);
      }
    }
    setTags(foundTags);
    setScore(total.toFixed(1));

    if (total < 20) setRecommendation("판매 추천");
    else if (total < 35) setRecommendation("조건부 보관");
    else setRecommendation("보관 추천");
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    Tesseract.recognize(file, 'kor', {
      logger: m => console.log(m)
    }).then(({ data: { text } }) => {
      setText(text);
      calculateScore(text);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Summoners War 룬 분석기</h1>
      <input type="file" onChange={handleChange} />
      <div>
        {image && <img src={image} alt="" style={{ maxWidth: '300px', marginTop: '20px' }} />}
        <h3>OCR 결과:</h3>
        <pre>{text}</pre>
        <h3>점수: {score}점</h3>
        <h3>추천: {recommendation}</h3>
        <h4>태그: {tags.join(', ')}</h4>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
