<template>
  <div :id="prop.tag" class="flex flex-col items-center hover:cursor-pointer select-none text-3xl hover:text-4xl"
    :style="{ color: color }" @mouseenter="handleIconMouseEnter(hover_src)" @mouseleave="handleIconMouseLeave(src)"
    @mousedown="handleIconMouseDown(click_src)" @mouseup="handleIconMouseUp(src)" @click="() => { emit('click') }">
    <img :id="tag + `_img`" ref="img_ref" draggable="false" :alt="tag" class="align-middle" :src="src" />
    <!-- <span class="" :id="'tag_' + key">{{ tag }}</span> -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

defineExpose({
  hover: handleIconMouseLeave
});

const emit = defineEmits(["click"])

const prop = withDefaults(defineProps<{
  /**
   * 图片url
   */
  src: string,
  /**
   * 是否默认选中,默认false
   */
  readonly default_click?: boolean,
  /**
   * 图片标签alt
   */
  tag?: string,
  /**
   * 鼠标悬停时图片url
   */
  hover_src?: string,
  /**
   * 鼠标点击时图片url
   */
  click_src?: string,
  /**
   * 动画时间 (s)
   */
  duration?: number,
  /**
   * 放大倍数
   */
  scale?: number,
  /**
   * 文本颜色
   */
  color?: string,
  /**
   * 点击时文本颜色
   */
  click_color?: string,
  /**
   * 鼠标悬浮时文本颜色
   */
  hover_color?: string,
}>(), {
  default_click: false,
  duration: 0.27,
  scale: 1.25
})
toRefs(prop)

const img_ref = ref<HTMLImageElement>()

onMounted(() => {
  setTimeout(() => {
    gsap.to(`#` + prop.tag, {
      color: prop.color || "rgb(" + getMainColor(img_ref.value!) + ")",
      duration: 0,
    })
    if (prop.default_click && img_ref) {
      gsap.to(`#` + prop.tag, {
        color: prop.click_color || "rgb(" + getMainColor(img_ref.value!) + ")",
        duration: 0
      })
      img_ref.value!.src = prop.click_src || prop.src
    }
  }, 100)
})

function handleIconMouseEnter(hover?: string) {
  if (prop.default_click) {
    return
  }
  if (img_ref.value) {
    gsap.to(`#` + prop.tag, {
      duration: prop.duration,
      scale: prop.scale
    }).then(() => {
      if (hover) {
        img_ref.value!.src = hover
      }
      gsap.to(`#` + prop.tag, {
        color: prop.hover_color || "rgb(" + getMainColor(img_ref.value!) + ")",
        duration: 0.1,
      })
    })
  } else {
    // console.error("img_ref or span_ref is null!")
  }
}

function handleIconMouseLeave(src?: string) {
  if (img_ref.value) {
    gsap.to(`#` + prop.tag, {
      duration: prop.duration,
      scale: 1
    }).then(() => {
      if (prop.default_click) {
        return
      }
      if (src) {
        img_ref.value!.src = src
      }
      gsap.to(`#` + prop.tag, {
        color: prop.color || "rgb(" + getMainColor(img_ref.value!) + ")",
        duration: 0.1,
      })
    })
  } else {
    // console.error("img_ref or span_ref is null!")
  }
}

function handleIconMouseDown(click_src?: string) {
  if (!click_src) {
    return
  }
  if (img_ref.value) {
    img_ref.value!.src = click_src
    gsap.to(`#` + prop.tag, {
      color: prop.click_color || "rgb(" + getMainColor(img_ref.value!) + ")",
      duration: 0.1
    })
  } else {
    // console.error("img_ref or span_ref is null!")  
  }
}

function handleIconMouseUp(src: string) {
  if (img_ref.value) {
    if (prop.default_click) {
    } else {
      img_ref.value!.src = src
    }
    gsap.to(`#` + prop.tag, {
      color: prop.hover_color || "rgb(" + getMainColor(img_ref.value!) + ")",
      duration: 0.1
    })
  } else {
    // console.error("img_ref or span_ref is null!")
  }
}

function getMainColor(image?: HTMLImageElement): string {
  if (!image) {
    return '0,0,0'
  }
  // 创建一个空白的Canvas元素  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // 将图片绘制到Canvas上  
  canvas.width = image.width;
  canvas.height = image.height;
  context!.drawImage(image, 0, 0, image.width, image.height);

  // 获取图片的像素数据  
  const imageData = context!.getImageData(0, 0, image.width, image.height);
  const pixels = imageData.data;

  // 计算每个颜色的RGB分量之和  
  let colorSums: number[] = Array(256).fill(0);
  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const color = (red + green + blue) / 3;
    colorSums[Math.floor(color)]++;
  }

  // 找到出现次数最多的颜色  
  let maxCount = 0;
  let mainColor = 0;
  for (let i = 0; i < colorSums.length; i++) {
    if (colorSums[i] > maxCount) {
      maxCount = colorSums[i];
      mainColor = i;
    }
  }

  // 将颜色的RGB值转化为十六进制字符串  
  const red = Math.floor((mainColor >> 16) & 255);
  const green = Math.floor((mainColor >> 8) & 255);
  const blue = Math.floor((mainColor) & 255);
  const rgb = `${red}${red.toString().length < 2 ? '0' : ''}${green}${green.toString().length < 2 ? '0' : ''}${blue}`;
  const hex = `#${rgb}`;

  return `${red},${green},${blue}`;
}
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
}
</style>