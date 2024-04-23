import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// 1. 配置路由
const routes: Array<RouteRecordRaw> = [
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
    path: "/:pathMatch(.*)*",
    component: () => import("@/404.vue"),
    meta: {
      title: "Not Found",
    },
  },
];
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
