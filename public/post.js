var like=0;
function likeButton(){
    console.log("entered the function");
    let heart=document.querySelector('.heart');
    let likes=document.querySelector('.clickcount');
    if(heart.src.match("heart.png")){
        heart.src="heart_red.png";
        like++;
        likes.innerHTML=like;
    }
    else
    {
        heart.src="heart.png";
    }
} 
