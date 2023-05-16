const likeBtn = document.querySelector('.like-btn');
const likeCount = document.querySelector('.like-count');
let count = 0;

likeBtn.addEventListener('click', () => {
  count++;
  likeCount.textContent = count;
});
