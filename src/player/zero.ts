import BasePlayer, { IBasePlayer, Role } from "@/player/base";
import stand from "@/assets/phaser/zero/zero_stand.png";
import json from "@/assets/phaser/zero/zero_json.json";
class Zero extends BasePlayer implements IBasePlayer {
  declare scene: Phaser.Scene;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Role.Zero);
    this.scene = scene;
    this.setCollideWorldBounds(true);
    this.setVelocityY(200);
    //修改判定范围
    this.texture.getFrameNames().forEach((frameName) => {
      const frame = this.texture.get(frameName);
      frame.setTrim(
        frame.width,
        frame.height,
        0,
        12,
        frame.width,
        frame.height - 24
      );
    });
    //待机动画
    this.anims.create({
      key: "stand",
      sortFrames: true,
      frames: this.anims.generateFrameNames(Role.Zero, {
        start: 0,
        end: 5,
        prefix: "image",
        suffix: ".png",
      }),
      yoyo: true,
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "move_on_platform",
      sortFrames: true,
      frames: this.anims.generateFrameNames(Role.Zero, {
        start: 6,
        end: 15,
        prefix: "image",
        suffix: ".png",
      }),
      yoyo: true,
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "jump_from_platform",
      sortFrames: true,
      frames: this.anims.generateFrameNames(Role.Zero, {
        frames: [16, 17, 19, 20, 21, 22],
        prefix: "image",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "in_air",
      sortFrames: true,
      frames: this.anims.generateFrameNames(Role.Zero, {
        frames: [17, 19, 20, 21, 22],
        prefix: "image",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: "fall",
      sortFrames: true,
      frames: this.anims.generateFrameNames(Role.Zero, {
        frames: [22, 23, 24, 25],
        prefix: "image",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: "fall_touch_platform",
      sortFrames: true,
      frames: this.anims.generateFrameNames(Role.Zero, {
        frames: [25, 26, 27, 28],
        prefix: "image",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: 0,
    });
  }
  //配置站在平台上，后续可优化到base
  standPlatform(platforms: Phaser.Physics.Arcade.StaticGroup) {
    this.scene.physics.add.collider(this, platforms, () => {
      if (this.body.touching.down) {
        this.anims.play("stand", true);
        this.setVelocityY(0);
      }
    }); //
  }
  //需要在preload调用的预加载
  static preload(scene: Phaser.Scene) {
    scene.load.atlas(Role.Zero, stand, json);
  }
}

export default Zero;
