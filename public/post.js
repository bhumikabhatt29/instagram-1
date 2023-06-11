var likes=1;
function likeButton(){
    console.log("entered the function");
    let heart=document.querySelector('.heart');
    let likes=document.querySelector('.likes');
    if(heart.scr.match("heart.png")){
        heart.src="heart_red.png";
        likes.innerHTML=likes+=likes;
    }
    else
    {
        heart.src="heart.png";
    }
} 

