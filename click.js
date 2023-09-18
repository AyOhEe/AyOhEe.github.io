var G_IsPlayingClick = false;

function ClickSfx() {
    //only play if a click isn't already playing
    if(G_IsPlayingClick){
        return;
    }


    //choose the sound effect to play
    var path = "Clicks/click-" + GenerateRandomIndex(11).toString() + ".mp3";

    //create the audio element
    let sfx = new Audio(path);
    sfx.play();

    //toggle playing and switch off when done
    G_IsPlayingClick = true;
    sfx.onended = () => {
        G_IsPlayingClick = false;
    };
}

function GenerateRandomIndex(max){
    return Math.floor(Math.random() * (max + 1));
}