import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "./layouts/MainLayout.vue";
import HomeView from "./views/HomeView.vue";
import TicketDetailView from "./views/ticket/TicketDetailView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "ticket-management",
          component: HomeView
        }
      ]
    },
    {
      path: "/ticket/:id",
      name: "ticket-detail",
      component: TicketDetailView
    }
  ]
});

export default router;
