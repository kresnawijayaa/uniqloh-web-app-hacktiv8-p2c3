import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("../views/Favorites.vue"),
    },
    {
      path: "/products/:id",
      name: "detail",
      component: () => import("../views/Detail.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (!localStorage.access_token && to.path === "/favorites") {
    next("/login");
  } else if (
    localStorage.access_token &&
    (to.path === "/login" || to.path === "/register")
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
