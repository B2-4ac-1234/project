<template>
    <div>
        <video ref="player" width="500" height="300" id="player" controls preload="auto" controlslist="nodownload">
            <!-- 也可以选视频文件 -->
            <source :src="'https://www.xzmp3.com/down/ca50c6b6a9c8.mp3'" type="audio/mp3" />
        </video>
    </div>
</template>
<script setup lang="ts">
import "mediaelement/build/mediaelementplayer.css";
import "mediaelement/build/mediaelement-and-player"; //因为7.0.5版本没有默认导出，所以需要这种方式引入
import MediaElementPlayer from "@/utils/MediaElementPlayer"; //可以尝试直接定义declare let MediaElementPlayer: any;如果没报错,这里可以代替这一步
import icon from "mediaelement/build/mejs-controls.svg"; //引入图标,避免按钮黑色,能点击有效果但没有样式
const player = ref(); //也可以在onMounted中使用document.getElementById("player")来获取对象
onMounted(() => {
    //具体api参考 https://github.com/mediaelement/mediaelement/blob/master/docs/api.md
    new MediaElementPlayer(player.value, {
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
</script>

<style scoped></style>