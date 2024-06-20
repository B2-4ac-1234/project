<template>
  <div>
    <p>demo1</p>
    <div id="game-container"></div>
  </div>
</template>

<script setup lang="ts">
import Phaser from "phaser";
import sky from "@/assets/phaser/demo1/sky.png";
import platform from "@/assets/phaser/demo1/platform.png";
import star from "@/assets/phaser/demo1/star.png";
import bomb from "@/assets/phaser/demo1/bomb.png";
import dude from "@/assets/phaser/demo1/dude.png";


interface Star extends Phaser.GameObjects.Sprite {
  /**
   * 是否被收集
   */
  collected: boolean
}
//写法最好通过继承创建,才能提供ts提示
class Preload extends Phaser.Scene {

  /**
   * 游戏宽度
   */
  width: number = 800;

  /**
   * 游戏高度
   */
  height: number = 600;

  /**
   * 游戏结束
   */
  gameOver: boolean = false;
  /**
   * 游戏结束文本
   */
  gameOverText: Phaser.GameObjects.Text;
  /**
   * 平台组
   */
  platforms: Phaser.Physics.Arcade.StaticGroup;
  /**
   * 玩家
   */
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  /**
   * 星星
   */
  stars: Phaser.Physics.Arcade.Group;
  /**
   * 炸弹
   */
  bombs: Phaser.Physics.Arcade.Group;
  /**
   * 分数
   */
  score: number = 0;
  /**
   * 键盘控制
   */
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  /**
   * 游戏时间
   */
  gameTime: number = 0;
  /**
   * 最大跳跃次数(二段跳)
   */
  MaxJumpCount: number = 2;
  /**
   * 当前跳跃次数
   */
  jumpCount: number = this.MaxJumpCount;
  /**
   * 移动速度
   */
  moveSpeed: number = 180;

  /**
   * 最大移动速度
   */
  moveSpeedMax: number = 260;

  constructor() {
    super("Preload");
  }
  preload() {
    this.load.image("sky", sky);
    this.load.image("platform", platform);
    this.load.image("star", star);
    this.load.image("bomb", bomb);
    this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 });
  }
  create() {
    //https://phaser.io/tutorials/making-your-first-phaser-3-game-chinese/part10
    this.add.image(400, 300, "sky");
    this.platforms = this.physics.add.staticGroup(); //静态物理组（Group）,静态物体只有位置和尺寸。重力对它没有影响，你不能给它设置速度，有东西跟它碰撞时，它一点都不动
    this.platforms.create(400, 568, "platform").setScale(2).refreshBody();
    this.platforms.create(600, 400, "platform");
    this.platforms.create(50, 250, "platform");
    this.platforms.create(750, 220, "platform");

    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.player.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.player.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.player.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.player.body.setMaxVelocityX(this.moveSpeedMax);
    this.player.body.setMaxVelocityY(this.moveSpeedMax * 2);
    this.physics.add.collider(this.player, this.platforms, () => {
      if (this.player.body.touching.down) {
        this.jumpCount = this.MaxJumpCount;
        this.player.setVelocityY(0);
      }
    }); //碰撞器（Collider）是施魔法的地方。它接收两个对象，检测二者之间的碰撞，并使二者分开,如果玩家站在平面上，则重置二段跳次数。

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.left.on("down", () => {
      this.player.setVelocityX(-this.moveSpeed / 1.6);
      this.player.setAccelerationX(-this.moveSpeed);
    });
    this.cursors.left.on("up", () => {
      this.player.setAccelerationX(0);
    });
    this.cursors.right.on("down", () => {
      this.player.setVelocityX(this.moveSpeed / 1.6);
      this.player.setAccelerationX(this.moveSpeed);
    });
    this.cursors.right.on("up", () => {
      this.player.setAccelerationX(0);
    });
    this.cursors.down.on("down", () => {
      this.player.setVelocityY(600);
    });
    this.cursors.up.on("down", () => {
      if (this.jumpCount > 0) {
        console.log(`output->this.doubleJump`, this.jumpCount);
        this.jumpCount--;
        this.gameTime = this.game.getTime() + 20;
        this.player.body.setVelocityY(-330);
      }
    });

    // 默认重力
    this.player.body.setGravityY(280);
    this.player.body.setAccelerationY(150);

    var scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      color: "#000",
    });
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 5,
      setXY: { x: 12, y: 0, stepX: 100 },
    });
    this.stars.getChildren().forEach(function (star) {
      star.body.velocity.y = Phaser.Math.Between(40, 80);
    });
    // 星星与平台碰撞,避免星星穿透平台
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.stars, this.stars); // 星星与星星碰撞,避免星星重叠
    // 当人物和星星碰撞时，触发回调函数
    this.physics.add.overlap(
      this.player,
      this.stars,
      (player, star) => {
        const _width = this.width
        if ((star as Star).collected) {
          return;
        }
        // 销毁星星
        (star as Star).setVisible(false).setActive(false);
        (star as Star).collected = true;
        // 增加分数
        this.score += 10;
        scoreText.setText("Score: " + this.score);
        // 所有星星吃完，随机生成一批新的星星
        if (this.stars.countActive(true) === 0) {
          this.stars.getChildren().forEach(function (star) {
            star.body.position.x = Math.random() * _width;
            star.body.velocity.y = Phaser.Math.Between(100, 120);
            (star as Star)
              .setVisible(true)
              .setActive(true);
              (star as Star).collected = false;
          });
        }
      },
      null,
      this
    );

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, (player, bomb) => {
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play("turn");
      this.gameOver = true;
      this.gameOverText = this.add.text(400, 300, "Game Over", {
        fontSize: "64px",
        color: "#000",
      });
    });
  }
  // update()方法在每帧被调用，用来更新游戏状态
  update() {
    if (!this.player.body.touching.down) {
      //如果在空中，则减少摩擦力
      // this.player.setFrictionX(0.8)
      this.player.setDrag(this.moveSpeed / 2, this.moveSpeed / 2);
    }else{
      this.player.setDragX(this.moveSpeed);
    }
    // 如果没走，则播放空闲动画
    if (this.player.body.velocity.x == 0) {
      this.player.anims.play("turn");
    }
    if (this.player.body.velocity.x > 0) {
      this.player.anims.play("right", true);
    }
    if (this.player.body.velocity.x < 0) {
      this.player.anims.play("left", true);
    }
    // if (this.player.body.onWorldBounds) {
    // this.player.setVelocityX(0);
    // }
    this.stars.getChildren().forEach(star => {
      if (star.body.position.x < 0) {
        star.body.position.x = 0;
        star.body.velocity.x *= -1;
      } else if (star.body.position.x > this.width) {
        star.body.position.x = this.width;
        star.body.velocity.x *= -1;
      }

      if (star.body.position.y < 0) {
        star.body.position.y = 0;
        star.body.velocity.y *= -1;
      } else if (star.body.position.y > this.height) {
        star.body.position.y = this.height;
        star.body.velocity.y *= -1;
      }
    });
  }
}

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  //设置div容器，配合css设置宽高
  parent: 'game-container',
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scale:{
    //游戏画布在父级中水平和垂直居中,自动缩放模式
    mode: Phaser.Scale.CENTER_BOTH,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: new Preload(),
};

onMounted(()=>{
  new Phaser.Game(config);
})
</script>

<style scoped>
#game-container{
  width: 50%;
  height: 50%;
}
</style>
