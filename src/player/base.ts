abstract class BasePlayer
  extends Phaser.Physics.Arcade.Sprite
  implements Phaser.Types.Physics.Arcade.GameObjectWithBody, IBasePlayer
{
  constructor(scene: Phaser.Scene, x: number, y: number, name: string) {
    super(scene, x, y, name);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }
  standPlatform(platforms: Phaser.Physics.Arcade.StaticGroup): void {
    throw new Error("Method not implemented.");
  }
}

export default BasePlayer;

export interface IBasePlayer {
  standPlatform(platforms: Phaser.Physics.Arcade.StaticGroup): void;
}

export const enum Role {
  Zero = "zero",
}
