const express = require('express');
const path = require('path');
const app = express();

// ビューエンジンにEJSを設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));

// ルート設定
app.get('/', (req, res) => {
  res.render('home', { title: 'ホームページ', activePage: 'home' });
});

app.get('/quiz-multiple', (req, res) => {
  res.render('quiz-multiple', { title: '4択クイズ', activePage: 'multiple' });
});

app.get('/quiz-free', (req, res) => {
  res.render('quiz-free', { title: '自由記述クイズ', activePage: 'free' });
});

app.get('/quiz-audio', (req, res) => {
  res.render('quiz-audio', { title: '音階当てクイズ', activePage: 'audio' });
});

app.get('/quiz-sheet', (req, res) => {
  res.render('quiz-sheet', { title: '楽譜クイズ', activePage: 'sheet' });
});

app.listen(3000, () => {
  console.log('サーバーがポート3000で起動しました');
});

module.exports = app;