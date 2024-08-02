<template>
  <div>
    <p>demo2</p>
    <div id="game-container"></div>
  </div>
</template>

<script setup lang="ts">
import sky from "@/assets/phaser/demo1/sky.png";
import platform from "@/assets/phaser/demo1/platform.png";
import BasePlayer from "@/player/base";
import Zero from "@/player/zero";

//写法最好通过继承创建,才能提供ts提示
class Preload extends Phaser.Scene {
  platforms: Phaser.Physics.Arcade.StaticGroup;

  player: BasePlayer;

  preload() {
    this.load.image("sky", sky);
    this.load.image("platform", platform);
    Zero.preload(this)
  }

  create() {
    this.add.image(400, 300, "sky");
    this.platforms = this.physics.add.staticGroup(); //静态物理组（Group）,静态物体只有位置和尺寸。重力对它没有影响，你不能给它设置速度，有东西跟它碰撞时，它一点都不动
    this.platforms.create(400, 570, "platform").setScale(2).refreshBody();
    this.platforms.create(600, 400, "platform");
    this.platforms.create(50, 250, "platform");
    this.platforms.create(750, 220, "platform");
    this.player = new Zero(this,100,450)
    this.player.standPlatform(this.platforms)
  }

  update(time: number, delta: number): void {

  }
}

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  //设置div容器，配合css设置宽高
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scale: {
    //游戏画布在父级中水平和垂直居中,自动缩放模式
    mode: Phaser.Scale.CENTER_BOTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: new Preload(),
};

onMounted(() => {
  new Phaser.Game(config);
});
</script>

<style scoped></style>
