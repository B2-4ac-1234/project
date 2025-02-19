<script setup lang="ts">
import bg_png from '@/assets/pixi/saiche/bg.png'
import boom_png from '@/assets/pixi/saiche/boom.png'
import emcar_png from '@/assets/pixi/saiche/emcar.png'
import mycar_png from '@/assets/pixi/saiche/mycar.png'

import { Application, Container, Sprite, Texture, Loader, Graphics, Text, TextStyle,Assets} from 'pixi.js';
import colors from 'tailwindcss/colors'

//创建一个pixi应用
let app = new Application();
// let loader

onMounted(async () => {
  // loader = await new Loader().load([bg_png, boom_png, emcar_png, mycar_png])
  await app.init({ background: colors.transparent, resizeTo: window});
  document.body.appendChild(app.canvas);
  setup();
})



let state,gameScene,gameOverScene,message,bg,mycarSprite,blobs,numberOfBlobs,score,hp;
async function setup() {
  numberOfBlobs = 2;//初始化最大敌车数量
  score = 0;//初始化分数
  hp = 5;//初始化HP
  document.getElementById('hp').innerHTML = String(hp);//将HP写入元素
  //设置游戏场景容器
  gameScene = new Container({
    width:240,
    height:120
  });
  app.stage.addChild(gameScene);
  //设置背景
  bg = new Sprite(await Assets.load(bg_png));
  bg.width = 480;
  bg.height = 120;
  gameScene.addChild(bg);

  //设置自己的车
  mycarSprite=new Sprite(await Assets.load(mycar_png));
  mycarSprite.position.set(2,5);//自己的车的初始位置
  mycarSprite.width = 18;//自己的车宽度
  mycarSprite.height = 11;//高度
  mycarSprite.vy = 0;//y轴加速度
  mycarSprite.vx = 0;//x轴加速度
  mycarSprite.invl = 0;//初始化无敌时间
  gameScene.addChild(mycarSprite);

  //一个存地方车辆的数组
  blobs = [];

  //创建一个游戏结束的场景
  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);

  //先让游戏结束场景隐藏
  gameOverScene.visible = false;

  //设置一个默认字体
  let style = new TextStyle({
    "wordWrap": true,
    "align": "center",
    "fill": "white",
    "fontSize": 14
  });
  message = new Text("", style);
  message.y = app.stage.height / 2 - 32;
  message.x = app.stage.width / 4;
  //字体中心点用于居中
  message.anchor.set(0.5,0.5)
  gameOverScene.addChild(message);

  //设置按键代码
  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);


  //左按下去之后
  left.press = function() {

    //改变自己车子的加速度
    mycarSprite.vx = -5;
    mycarSprite.vy = 0;
  };

  //松开左键
  left.release = function() {

    //防止键位冲突
    if (!right.isDown && mycarSprite.vy === 0) {
      mycarSprite.vx = 0;
    }
  };

  //Up
  up.press = function() {
    mycarSprite.vy = -5;
    mycarSprite.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && mycarSprite.vx === 0) {
      mycarSprite.vy = 0;
    }
  };

  //Right
  right.press = function() {
    mycarSprite.vx = 5;
    mycarSprite.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && mycarSprite.vy === 0) {
      mycarSprite.vx = 0;
    }
  };

  //Down
  down.press = function() {
    mycarSprite.vy = 5;
    mycarSprite.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && mycarSprite.vx === 0) {
      mycarSprite.vy = 0;
    }
  };
  state = play;
  app.ticker.add(delta => gameLoop(delta));
}
async function creatEMCar() {
  //设置敌人
  //根据最大敌车数创建车子
  for (let i = 0; i < numberOfBlobs - blobs.length; i++) {

    //创建敌车
    let blob = new Sprite(await Assets.load(emcar_png));
    blob.width = 18;
    blob.height = 11;
    let EMCarIsHit = true;
    while (EMCarIsHit) {
      //随机车子x坐标在画布外
      let x = randomInt(250, 500);

      //随机y坐标在画布范围内
      let y = randomInt(2, app.stage.height - 2 - blob.height);

      //设置车辆位置
      blob.x = x;
      blob.y = y;

      //检测车辆位置是否有重叠
      EMCarIsHit = checkEMCarPositionHit(blob);
    }

    //将车子加入数组
    blobs.push(blob);

    //渲染
    gameScene.addChild(blob);
  }
}
//检查生成的地方车辆是否有重叠
function checkEMCarPositionHit(blob){
  for(var i=0;i<blobs.length;i++){
    if(hitTestRectangle(blob,blobs[i])){
      return true;
      break;
    }
  }
}
function gameLoop(delta){
  //更新游戏场景:
  state(delta);
}
async function play(delta) {
  //背景移动
  bg.x -= 10;
  if (bg.x < -230) {
    bg.x = 0;
  }
  //移动赛车
  mycarSprite.x += mycarSprite.vx;
  mycarSprite.y += mycarSprite.vy;
  if (mycarSprite.invl > 0) {
    mycarSprite.invl--;
  }
  //判断车辆是否超出画布
  contain(mycarSprite, { x: 0, y: 2, width: 240, height: 118 });
  //设置敌人
  creatEMCar();
  let explorerHit = false;
  //移动敌人
  blobs.forEach(function(blob) {

    //移动地方车辆
    blob.x -= 5;

    //如果和我方车辆发生碰撞
    if (hitTestRectangle(mycarSprite, blob)) {
      explorerHit = true;
    }
  });
  //去除已经行驶到画布外的敌军车辆
  removeEmCar();
  //加分
  score += 1;
  document.getElementById('score').innerHTML = String(score);
  //如果分数大于2000则每1000分场景车辆+1，最多八辆
  if (score > 2000) {
    numberOfBlobs = Math.floor(score / 1000);
    if (numberOfBlobs > 8) {
      numberOfBlobs = 8;
    }
  }
  //如果发生碰撞且在无敌时间之外
  if (explorerHit && mycarSprite.invl === 0) {

    //车子图片变更为爆炸
    mycarSprite.texture = await Assets.load(boom_png);
    //减血
    hp--;
    document.getElementById('hp').innerHTML = String(hp);
    //判断是否血量归零
    if (hp < 1) {
      //抛出游戏结束
      state = end;
      message.text = "你的车炸了！刷新重来";
    }
    mycarSprite.invl = 30//设置无敌时间

  } else if (mycarSprite.invl <= 0) {//如果不在无敌时间内
    //车辆贴图变回去
    mycarSprite.texture = await Assets.load(mycar_png);
  } else {//其他情况
    mycarSprite.texture = await Assets.load(mycar_png);
  }
}
//移除已经行驶到画布外围的敌方车辆
function removeEmCar(){
  for(var i=0;i<blobs.length;i++){
    if(blobs[i].x<-50){
      //从数组删除
      blobs.splice(i, 1);
      //从场景删除
      gameScene.removeChildAt(i+2);
    }
  }
}
//按键方法
function keyboard(keyCode) {
  var key:any = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
//判断是否超出画布
function contain(sprite, container) {

  let collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  return collision;
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//碰撞检测
function hitTestRectangle(r1, r2) {

  //设置需要的变量
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //初始化是否碰撞
  hit = false;

  //寻找精灵中心点
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //计算精灵一半的宽度和高度
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //计算相互之间的距离
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //计算xy重叠的数值
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //检查x轴是否充电
  if (Math.abs(vx) < combinedHalfWidths) {

    //再检查y轴
    if (Math.abs(vy) < combinedHalfHeights) {

      //如果是则判断为碰撞
      hit = true;
    } else {

      //否则为没碰撞
      hit = false;
    }
  } else {

    //x轴没有碰撞
    hit = false;
  }

  //传是否碰撞
  return hit;
}
//游戏结束显示游戏结束场景，隐藏游戏场景
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}
</script>

<template>
<p>saiche</p>
  <p>copy from https://gitee.com/eeg1412/pixijs_chinese_course/blob/master/myGame/saiche/saiche.html</p>
  <p><span>分数：</span><span id="score"></span></p>
  <p><span>HP：</span><span id="hp"></span></p>

</template>

<style scoped>

</style>