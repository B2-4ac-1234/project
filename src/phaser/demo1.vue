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

//写法最好通过继承创建,才能提供ts提示
class Preload extends Phaser.Scene {

  platforms: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  stars: Phaser.Physics.Arcade.Group;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  gameTime: number = 0;
  MaxJumpCount: number = 2;//最大跳跃次数
  jumpCount: number = this.MaxJumpCount;//可跳跃次数,用来实现多段跳
  moveSpeed: number = 200;

  constructor() {
    super('Preload');
  }
  preload() {
    this.load.image('sky', sky);
    this.load.image('platform', platform);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet('dude', dude,
      { frameWidth: 32, frameHeight: 48 }
    );
  }
  create() {
    //https://phaser.io/tutorials/making-your-first-phaser-3-game-chinese/part3
    this.add.image(400, 300, 'sky');
    this.platforms = this.physics.add.staticGroup();//静态物理组（Group）,静态物体只有位置和尺寸。重力对它没有影响，你不能给它设置速度，有东西跟它碰撞时，它一点都不动
    this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'platform');
    this.platforms.create(50, 250, 'platform');
    this.platforms.create(750, 220, 'platform');
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.player.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.player.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.player.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.physics.add.collider(this.player, this.platforms);//碰撞器（Collider）是施魔法的地方。它接收两个对象，检测二者之间的碰撞，并使二者分开。
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.left.on('down', () => {
      this.player.setVelocityX(-this.moveSpeed);
    })
    this.cursors.left.on('up', () => {
      if (!this.cursors.right.isDown) {
        this.player.setVelocityX(0);
      } else {
        this.player.setVelocityX(this.moveSpeed);
      }
    })
    this.cursors.right.on('down', () => {
      this.player.setVelocityX(this.moveSpeed);
    })
    this.cursors.right.on('up', () => {
      if (!this.cursors.left.isDown) {
        this.player.setVelocityX(0);
      } else {
        this.player.setVelocityX(-this.moveSpeed);
      }
    })
    this.cursors.down.on('down', () => {
      this.player.setVelocityY(600);
    })
    this.cursors.up.on('down', () => {
      if (this.jumpCount > 0) {
        console.log(`output->this.doubleJump`, this.jumpCount);
        this.jumpCount--
        this.gameTime = this.game.getTime() + 20;
        this.player.setVelocityY(-330);
      }
    })

    // 默认重力
    this.player.body.setGravityY(300)
  }
  // update()方法在每帧被调用，用来更新游戏状态
  update() {
    // 如果落地，则重置跳跃次数
    if (this.player.body.touching.down) {
      this.jumpCount = this.MaxJumpCount;
      this.player.setVelocityY(0);
    }
    // 如果没走，则播放空闲动画
    if (this.player.body.velocity.x == 0) {
      this.player.anims.play('turn');
    }
    if (this.player.body.velocity.x > 0) {
      this.player.anims.play('right', true);
    }
    if (this.player.body.velocity.x < 0) {
      this.player.anims.play('left', true);
    }
  }
}


var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false
    }
  },
  scene: new Preload()
};

new Phaser.Game(config);

</script>

<style scoped></style>