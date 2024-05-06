<template>
  <div>
    <p>demo1</p>
  </div>
</template>

<script setup lang="ts">
import Phaser from 'phaser'
import sky from "@/assets/phaser/demo1/sky.png"
import platform from "@/assets/phaser/demo1/platform.png"
import star from "@/assets/phaser/demo1/star.png"
import bomb from "@/assets/phaser/demo1/bomb.png"
import dude from "@/assets/phaser/demo1/dude.png"

var score = 0;
var scoreText;
var platforms;

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300, x: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', sky);
  this.load.image('platform', platform);
  this.load.image('star', star);
  this.load.image('bomb', bomb);
  this.load.spritesheet('dude', dude,
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create() {
  //https://phaser.io/tutorials/making-your-first-phaser-3-game-chinese/part3
  this.add.image(400, 300, 'sky');
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'platform').setScale(2).refreshBody();
  platforms.create(600, 400, 'platform');
  platforms.create(50, 250, 'platform');
  platforms.create(750, 220, 'platform');
}

function update() {
}
</script>

<style scoped></style>