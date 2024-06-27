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
      frameRate: 10,
      repeat: -1,
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
