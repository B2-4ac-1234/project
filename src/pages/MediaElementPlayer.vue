<template>
    <div style="width: 600px;">
        <div>
            <input v-model="url" style="width:500px;" placeholder="输入音频地址" />
            <button style="width:100px" @click="load()">确认</button>
        </div>
        <video ref="player" width="500" height="300" id="player" controls preload="auto" controlslist="nodownload">
            <!-- 也可以选视频文件 -->
            <source :src="url" />
        </video>
    </div>
</template>
<script setup lang="ts">
import "mediaelement/build/mediaelementplayer.css";
import "mediaelement/build/mediaelement-and-player"; //因为7.0.5版本没有默认导出，所以需要这种方式引入
import MediaElementPlayer from "@/utils/MediaElementPlayer"; //可以尝试直接定义declare let MediaElementPlayer: any;如果没报错,这里可以代替这一步
import icon from "mediaelement/build/mejs-controls.svg"; //引入图标,避免按钮黑色,能点击有效果但没有样式
const url = ref("https://www.xzmp3.com/down/ca50c6b6a9c8.mp3"); //默认mp3播放路径
const player = ref(); //也可以在onMounted中使用document.getElementById("player")来获取对象
var media: any = ref();
onMounted(() => {
    //具体api参考 https://github.com/mediaelement/mediaelement/blob/master/docs/api.md
    media = new MediaElementPlayer(player.value, {
        controls: true,
        // poster: getImageUrl("ic_icon.png"),
        stretching: "fill",
        iconSprite: icon,
        // autosizeProgress: false,
        success: function (mediaElement, originalNode) {
            console.log("Player initialized successfully!");
        },
        error: function (mediaElement, originalNode, error) {
            console.error("Error initializing player:", error);
        },
    });
});
function load() {
    media.setSrc(url.value); //设置新播放源
    media.load(); //重新载入
    media.play(); //播放
}
onUnmounted(() => {
    media.remove();
});
</script>

<style scoped></style>