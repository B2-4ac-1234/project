<template>
  <div>
    <div class="home">
      <ul>
        <li> <router-link :to="{ path: '/404' }">404</router-link></li>
        <li> <router-link :to="{ path: '/imageHover' }">图片放大组件</router-link></li>
        <li> <router-link :to="{ path: '/MediaElementPlayer' }">MediaElementPlayer视频播放组件</router-link></li>
      </ul>
      <br/>
      <p>phaser.js</p>
      <ul v-for="item in phaserRoutes">
        <li><router-link :to="item.path">{{ item.name }}</router-link></li>
      </ul>
      <br/>
      <p>pixi.js</p>
      <ul v-for="item in pixiRoutes">
        <li><router-link :to="item.path">{{ item.name }}</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

const phaserRouters: any = import.meta.glob('@/phaser/*.vue', { eager: true })

const phaserRoutes = Object.keys(phaserRouters).map(key => {
  const path = key.substring(key.lastIndexOf("/"), key.length + 1).replaceAll(".vue", "")
  return {
    name: `/phaser/${path.replace("/", "")}`,
    path: `/phaser${path}`,
  }
})

const pixiRouters: any = import.meta.glob('@/pixi/*.vue', { eager: true })

const pixiRoutes = Object.keys(pixiRouters).map(key => {
  const path = key.substring(key.lastIndexOf("/"), key.length + 1).replaceAll(".vue", "")
  return {
    name: `/pixi/${path.replace("/", "")}`,
    path: `/pixi${path}`,
  }
})
</script>

<style scoped></style>