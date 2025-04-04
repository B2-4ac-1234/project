import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// 1. 配置路由
var routes: Array<RouteRecordRaw> = [
  {
    path: "/", // 默认路由 home页面
    component: () => import("@/home.vue"),
    meta: {
      title: "Home",
    },
  },
  {
    path: "/imageHover",
    component: () => import("@/pages/ImageHoverEnlargeView.vue"),
  },
  {
    path: "/MediaElementPlayer",
    component: () => import("@/pages/MediaElementPlayer.vue"),
  },
];

const phaserRouters: any = import.meta.glob("@/phaser/*.vue", { eager: true });
// routes.push(metaRouters)
Object.keys(phaserRouters).forEach((key) => {
  const path = key
    .substring(key.lastIndexOf("/"), key.length + 1)
    .replaceAll(".vue", "");
  console.log(path);
  const component = phaserRouters[key];
  routes.push({
    path: `/phaser/${path}`,
    component: component.default || component,
    name: `/phaser${path}`,
  });
});

const pixiRouters: any = import.meta.glob("@/pixi/*.vue", { eager: true });
// routes.push(metaRouters)
Object.keys(pixiRouters).forEach((key) => {
  const path = key
    .substring(key.lastIndexOf("/"), key.length + 1)
    .replaceAll(".vue", "");
  console.log(path);
  const component = pixiRouters[key];
  routes.push({
    path: `/pixi/${path}`,
    component: component.default || component,
    name: `/pixi${path}`,
  });
});
// for (const key in metaRouters) {
//   const path = key.substring(key.lastIndexOf("/"), key.length).replaceAll(".vue", "")
//   console.log(path);
//   console.log(metaRouters[key]);
//   routes.push({
//     path: path,
//     component: metaRouters[key],
//   })
// }

routes.push({
  path: "/:pathMatch(.*)*",
  component: () => import("@/404.vue"),
  meta: {
    title: "Not Found",
  },
});
// 2.返回一个 router 实列，为函数，配置 history 模式
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.afterEach((to) => {
  const { title, keywords, description } = to.meta;
  if (title) {
    document.title = title as string;
  }
  if (keywords) {
    const metaKeywords: HTMLMetaElement | null = document.querySelector(
      'meta[name="keywords"]'
    );
    if (metaKeywords) {
      metaKeywords.content = keywords as string;
    }
  }
  if (description) {
    const metaDescription: HTMLMetaElement | null = document.querySelector(
      'meta[name="description"]'
    );
    if (metaDescription) {
      metaDescription.content = description as string;
    }
    const OgmetaDescription: HTMLMetaElement | null = document.querySelector(
      'meta[name="og:description"]'
    );
    if (OgmetaDescription) {
      OgmetaDescription.content = description as string;
    }
  }
});

// 3.导出路由   去 main.ts 注册 router.ts
export default router;
