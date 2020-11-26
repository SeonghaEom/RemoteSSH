import '/howler.js/src/howler.core.js';
import "/howler.js/src/plugins/howler.spatial.js";

var id;

var sound_my_group=new Howl({
    src:['audio_files/dialogue_1.mp3']
})

var sound_group_1=new Howl({
    src:['audio_files/dialogue_2.mp3']
})

var sound_group_2=new Howl({
    src:['audio_files/dialogue_3.mp3']
})

function play_my_group(){
    sound_my_group.play()
}

function pause_my_group(){
    sound_my_group.pause()
}

function play_group_1(){
    sound_group_1.play()
    sound_group_1.pos(-2,-2,-0.5,id)
}

function pause_group_1(){
    sound_group_1.pause()
}

function play_group_2(){
    sound_group_2.play()
    sound_group_2.pos(2,-2,-0.5,id)
}

function pause_group_2(){
    sound_group_2.pause()
}

document.getElementById("play_my").onclick = play_my_group;
document.getElementById("pause_my").onclick = pause_my_group;
document.getElementById("play_1").onclick = play_group_1;
document.getElementById("pause_1").onclick = pause_group_1;
document.getElementById("play_2").onclick = play_group_2;
document.getElementById("pause_2").onclick = pause_group_2;
//console.log('here')