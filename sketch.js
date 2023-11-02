let mic, recorder, mixgain, mixmaster;
let soundFile = [];
var sounds = [];
let pos;
let cnv;
let del = [];
let vol = [];
let active =  [];
let lLength =  [];
let amplitude = [];
let soundGain = [];

let bpm = 0;
let beats = 0;
let interval = 0;
let lcm = 1;

let delaytime = 0.08;

var w = window.innerWidth;
var h = window.innerHeight;  

rspeed = 0;
pspeed = 0;
rstate = 0;
rstage = 1;
csize = 60;
preamp = 1;
len = 1;
margintop = 56;
recording = false;
saving = false;

function setup() {
  
  let cnv = createCanvas(w, h);
  //cnv.mousePressed(userStartAudio);
  cnv.mousePressed(canvasPressed);
  background(30);
  strokeWeight(1);
 
  textSize(10);
  
  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  
  song = new p5.SoundFile();
    
  lLength[0]=1;
  lLength[1]=1; 
  
  mixmaster = new p5.Gain();
  mixmaster.connect();
  mixmaster.amp(1);
 
  //soundFile[0] = new p5.SoundFile();
  /*
  input = createInput(60);
  input.position(w/4, 16);
  input.size(margintop-16,margintop-18);
  input.addClass("button");
 // input.textAlign(CENTER);
  input.style('font-size', '24px');
  input.style('textAlign', 'CENTER');
  
  delaystart = createButton('delay start bpm');
  delaystart.size(margintop-16,margintop-16);
  delaystart.position(input.x + input.width-2, 16);
  delaystart.addClass("button");
  delaystart.mousePressed(delayStart);
  */ 
   
  reset = createButton('reset'); 
  reset.size(margintop-16,margintop-16);
  reset.addClass("button");
  reset.position(w-reset.width, 16);
  reset.mousePressed(resetall);
  
  saveb = createButton('save'); 
  saveb.size(margintop-16,margintop-16);
  saveb.addClass("button");
  saveb.position(reset.x-reset.width-3, 16);
  saveb.mousePressed(saveSoundFile);
  
  uploaderstyle = createButton('upload');
  uploaderstyle.size(margintop-16,margintop-16);
  uploaderstyle.addClass("button");
  uploaderstyle.position(saveb.x-saveb.width-3, 16);
  
  let uploader = createFileInput(handleFile);
  uploader.style('opacity', '0');  
  uploader.size(margintop-16,margintop-16);
  uploader.position(saveb.x-saveb.width-3, 16);
  uploader.addClass("button");
 
  mic.amp(preamp);
  preampslider = createSlider(0,3,1,0.05);
  preampslider.position(10,31);
  preampslider.addClass("slider");
  fill(255);
  preampslider.input(function() { updatePreamp();});
  
  msdelay = createInput(delaytime*1000);
  msdelay.position(w/1.8,31);
  msdelay.size(30,15);
  msdelay.addClass("slider");
  fill(255);
  msdelay.input(function() { updateDelay();})
  
  fill(60);
  noStroke();
  rect(0,12,w,margintop-12);
  fill(255);
  text('mic preamp: '+preamp, preampslider.x+2, preampslider.y-1);
  text('input delay ms: '+delaytime*1000, msdelay.x+2, msdelay.y-1);

}

function draw(){
    
  if(recording == true){
    noStroke();
    fill(230,10,10);
    rect(0,0,w,16);
    fill(255);
    text('recording...', 12, 12);
    } else if (mic.enabled) {
    fill(5,160,5);
    rect(0,0,w,16);
    fill(255);
    text('ready for recording. click/press anywhere or tap any key', 12, 12); 
    }
  
  if(saving == true){
    noStroke();
    fill(180,190,10);
    rect(0,0,w,16);
    fill(255);
    text('saving... amount of loops to record: '+lcm, 12, 12);
    } 
    
  if(rstate == 1){
    stroke(244);
    let level = mic.getLevel();
    let lsize = map(level, 0, 1, 0, csize);
    if (lsize>csize){ lsize = csize-1; }
      if(rstage == 1){
               
        fill(34,120,200,45);
        noStroke();
        rect(rspeed,margintop+(csize*(rstage-1)),1,csize);
        
        stroke(244);
        strokeWeight(1);
        line(rspeed,margintop+(csize*(rstage)),rspeed,margintop+(csize*rstage)-lsize-1);
         
        rspeed++;
      } else {
        
        if(recording == true){
       
        fill(34,120,200,45);
        noStroke();  
        rect(pspeed,margintop+csize*(rstage-1),1,csize);
          
        stroke(244);
        strokeWeight(1);
        line(pspeed,margintop+(csize*rstage),pspeed,margintop+(csize*rstage)-lsize-1);
        
  
          if(soundFile[rstage].duration()>=soundFile[1].duration()*len){
            
            
          recording = false; 
          soundFile[rstage].loop(0,1,1,delaytime);    
        
          soundFile[rstage].disconnect();    
          soundGain[rstage] = new p5.Gain(); 
          soundGain[rstage].setInput(soundFile[rstage]);
          soundGain[rstage].amp(2);
          soundGain[rstage].connect(mixmaster);
            
          recorder.setInput(mic);  
            
          if(song.isPlaying() == true){song.setVolume(0);}
            
            rstage++;
            createbutton(rstage-1);
           
            createbuttonVol(rstage-1);
            
            
          while(del.length>rstage){  
          rstage++;
          }
            
             for (let i = del.length; i > 1; i--){
              
           if(active[i]==false){
         
             rstage=i;
           }
             }
           
          }
        
        }
        
      }
  
              
     } 
     
   if(rstage > 1){
     pspeed=pspeed+1/len;
     if(pspeed >= rspeed){
       pspeed = -1;
     }
     
   /*  for (let i = 1; i < soundFile.length; i++){
       if(active[i]==true){
     fill(253,43,222);  
     noStroke();
         rect(pspeed-1,csize*(i)+margintop,1,3);
     }
     }*/
       /*  if(pspeed == rspeed){
        pspeed = -1;
       for (let i = 1; i < soundFile.length; i++){
      noStroke();
      fill(30);
      rect(0,csize*i+margintop,rspeed+2,3);
     }
    }*/
  
    // print(soundFile[1].currentTime());
     

     for (let i = 1; i < soundFile.length; i++){
      noStroke();
      fill(30);
      rect(0,csize*i+margintop,rspeed+8,3);
     }
     
      for (let i = 1; i < soundFile.length; i++){
       if(active[i]==true){
       
       amplitude[i].setInput(soundFile[i]);    

       noStroke();
       let wo = map(soundFile[i].currentTime(), 0, soundFile[i].duration(), 0, rspeed);

       let level = amplitude[i].getLevel();
       let lsize = map(level, 0, 1, 0, csize);
       if (lsize>csize){ lsize = csize-2; }

       fill(31,46,60,80); 
       rect(wo-1,margintop+csize*(i-1),3,csize+2);    

       stroke(255);
       strokeWeight(2);
       line(wo,margintop+(csize*(i)),wo,margintop+(csize*i)-lsize-1);
       noStroke();    

       fill(253,33,102);
       rect(wo-4,csize*(i)+margintop,6,3);
         
       }
     }
    
     
}         
}


function canvasPressed() {
 
  userStartAudio();
  if(mouseY > margintop && mouseX < w-(margintop+3)){
  
    record();

}
}

function keyPressed() {

  userStartAudio();
 //if(mouseY > margintop){

       record();
//}
}

function resetall() {
  if(recording == false){
   if(soundFile.length>0){
     for (let i = 1; i < soundFile.length; i++){
    soundFile[i].stop();
     }
    background(30);
    rspeed = 0;
    pspeed = 0;
    rstate = 0;
    rstage = 1;  
    len = 1;
  
    for (let i = 2; i < del.length; i++){
    del[i].hide();
  }
     for (let i = 1; i < del.length; i++){
    vol[i].hide();
     }
   if(rstage===1) {vol[1].hide();}
  
  
  del.length=0;
  soundFile.length=0;
  vol.length=0;
  active.length=0;
  looplen.hide();
  fill(60);
  noStroke();
  rect(0,12,w,margintop-12);
  fill(255);
  text('mic preamp: '+preamp, preampslider.x+2, preampslider.y-1);
  text('input delay ms: '+delaytime*1000, msdelay.x+2, msdelay.y-1);
  }
 }
}

function createbutton(num) {
   
  del[num] = createButton(num+' delete'); 
  del[num].size(margintop-16,csize-2);
  del[num].addClass("button");
  del[num].position(w-del[num].width, margintop+(csize*(rstage-2))+2);
  del[num].mousePressed(function() { removelast(num);});
  del[num].show();
  active[num]=true;
  
}


function createbuttonVol(num) {
    
  vol[num] = createSlider(0,2.2,1,0.05); 
  vol[num].size(csize-2.5,15);  
  vol[num].position(w-(vol[num].width+23), margintop+(csize*(rstage-2))+21.7);
  vol[num].addClass("verSlider");
  vol[num].show();
  vol[num].input(function() { updateVol(num);});
    
}


function removelast(num1) {
 if(recording == false){
 soundFile[num1].stop();
 del[num1].hide();
 vol[num1].hide();
 active[num1]=false;
 fill(30);
 rect(0,margintop+(csize*(num1-1)),w,csize+3);
 rstage=num1;
 lLength[num1]=1;
}
}

function updateVol(num2){
  soundFile[num2].setVolume(vol[num2].value());
  
}

function updatePreamp(){
   //preamp val change 
  fill(60);
  noStroke();
  rect(0,12,w/3.5,margintop-12);
  fill(255);
  preamp = preampslider.value();
  text('mic preamp: '+preamp, preampslider.x+2, preampslider.y-1);
  mic.amp(preamp);
  
}

function updateDelay(){
   //preamp val change 
  fill(60);
  noStroke();
  rect(w/1.5,12,w/1.5,margintop-12);
  fill(255);
  delaytime = msdelay.value()/1000;
  text('input delay ms: '+delaytime*1000, msdelay.x+2, msdelay.y-1);
  
  
}

function onEnd() {

}

function startLoop() {
   if(soundFile[rstage].isLoaded()==true) {
    recording = false;
    active[1]=true; 
   // soundFile[rstage].addCue(0.05, onEnd);
    soundFile[rstage].loop();
    soundFile[rstage].disconnect();    
    soundGain[rstage] = new p5.Gain(); 
    soundGain[rstage].amp(2);
    soundGain[rstage].setInput(soundFile[rstage]);
    soundGain[rstage].connect(mixmaster);
   // soundFile[rstage].onended(function() { onLoopEnd(rstage);});
    rstate = 2;
    rstage ++; 
    createbuttonVol(rstage-1);
    nextLoopLength();
     
    if(song.isPlaying() == true){song.setVolume(0);}
     
  }else{
    setTimeout(startLoop,1);
   
    }
}

function nextLoopLength() {
  
  looplen = createSlider(1,10,1,1); 
  //looplen.size(csize-2,15);  
  looplen.position(w/3.5,31);
  looplen.addClass("slider");
 
  looplen.input(updateNextLoop);
   
  fill(60);
  noStroke();
  rect(looplen.x,12,w/4,margintop-12);
  fill(255); 
  text('next loop lenght: '+looplen.value(),       looplen.x+2, looplen.y-1);

}

function updateNextLoop(){
  if(recording == false){
  len = looplen.value();
  fill(60);
  noStroke();
  rect(looplen.x,12,w/4,margintop-12);
  fill(255);  
  text('next loop lenght: '+looplen.value(), looplen.x+2, looplen.y-1);
  }

  
  }
/*
function delayStart() {
  
  bpm = Number(input.value());
 
  let delay = 60 / bpm * 1000;
  beats = 4;
  interval = setInterval(updateCountdown, delay);

  }

function updateCountdown() {
    beats--;
   
  
  if (beats % 2 == 0) {
    fill(0,0,255);
    rect(0,0,w,margintop);
    } else {
    fill(255,255,0);
    rect(0,0,w,margintop);
    }
  

  if (beats <= 0) {
    clearInterval(interval);
    record();
    beats = 4;
  }
}*/

function record() {
  //recorder.setInput(mic);
  amplitude[rstage] = new p5.Amplitude();
  
/*  noStroke();
  fill(60);
  rect(0,0,w,margintop);*/
       if(rstage == 1 && recording == true){
       
    recorder.stop();
    startLoop();
        
    
    
   } else {
if (mic.enabled) {
  
    if(recording == false){
      
    
     soundFile[rstage] = new p5.SoundFile();
      
      if(rstage>1){
       
    recorder.record(soundFile[rstage],soundFile[1].duration()*len); 
    lLength[rstage]=len;
        
       // let wo = map(soundFile[1].currentTime(), 0, soundFile[1].duration(), 0, rspeed);
      //  pspeed=(wo);
        pspeed = 0;
      }else{
        
        recorder.record(soundFile[rstage]);
       
      }
    recording = true;
    rstate = 1;
    pos = pspeed;
     
    }
}
}

  }


function handleFile(file) {

  if (file.type === 'audio') {
      song = loadSound(file.data, function() {
         
      recorder = new p5.SoundRecorder();
      recorder.setInput(song);  
        
      song.play(); 
       
      soundFile[rstage] = new p5.SoundFile();
      amplitude[rstage] = new p5.Amplitude();  
      
      if(rstage>1){
       
    recorder.record(soundFile[rstage],soundFile[1].duration()*len);  
      }else{
        
        song.onended(stoprecUpload); 
        recorder.record(soundFile[rstage]);
        
      }
    recording = true;
    rstate = 1;
    pos = pspeed;
      
    });
  } else {
   
  }
}

function stoprecUpload() {
  recorder.stop();
  startLoop(); 
  recorder.setInput(mic);
 
  }

/*
function onLoopEnd(num) {
  
  for (let i = 1; i < active.length; i++){
   if(i!=1) {
    if(active[i]==true) {
      if(soundFile[i].currentTime() > (soundFile[i].duration()*0.80) ){
   soundFile[i].play();
       print(i+" is playing");
        }
        } 
      } 
   } 
soundFile[1].play();
  
        pspeed = -1;
       for (let i = 1; i < soundFile.length; i++){
      noStroke();
      fill(30);
      rect(0,(csize*i)+margintop,rspeed+2,3);
     }
  }*/

function saveSoundFile() {
 if(soundFile.length>0){
  lcm = lowestCommonMultiple(lLength);
  Sfile = new p5.SoundFile();
  Srecorder = new p5.SoundRecorder();
  Srecorder.setInput(mixmaster);  
  Srecorder.record(Sfile,soundFile[1].duration()*lcm);   
  saving=true;
  setTimeout(storeFile,(soundFile[1].duration()*1000*lcm)+100);
  }
 }   

function storeFile() {
  saving=false;
  saveSound(Sfile, 'loop_'+month()+'-'+day()+'_'+hour()+'-'+minute()+'.wav');
}

function lowestCommonMultiple(arr) {
 function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }
  function lcm(a, b) {
    return (a * b) / gcd(a, b);
  }
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = lcm(result, arr[i]);
  }  
  return result;
}
