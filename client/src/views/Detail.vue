<template>
  <section>
    <div
      class="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8"
    >
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-4">
        <div
          class="relative h-64 overflow-hidden rounded-lg sm:h-160 lg:order-last lg:h-full lg:col-span-3"
        >
          <img
            alt="Party"
            :src="productDetail.imgUrl"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div class="lg:col-span-2">
          <h2 class="text-xl font-bold text-gray-900 sm:text-3xl mt-4">
            {{ productDetail.name }}
          </h2>

          <p class="mt-4 text-gray-600">
            {{ productDetail.description }}
          </p>

          <div class="mt-8 sm:mt-8">
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 w-4/5">
              <div
                class="flex flex-col rounded-lg border border-gray-300 px-2 py-4 text-center"
              >
                <dt class="order-last text-md font-medium text-gray-500">
                  Price
                </dt>

                <dd class="text-2xl font-extrabold text-red-600 md:text-3xl">
                  $ {{ productDetail.price }}
                </dd>
              </div>

              <div
                class="flex flex-col rounded-lg border border-gray-300 px-2 py-4 text-center"
              >
                <dt class="order-last text-md font-medium text-gray-500">
                  Stock
                </dt>

                <dd class="text-2xl font-extrabold text-red-600 md:text-3xl">
                  {{ productDetail.stock }}
                </dd>
              </div>
            </dl>
          </div>

          <div class="w-4/5 mt-2">
            <div v-html="productDetail.qr" class="lg:w-100"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { RouterLink } from "vue-router";

import { mapState, mapActions } from "pinia";
import { useRootStore } from "../stores/root";

export default {
  computed: {
    ...mapState(useRootStore, ["productDetail"]),
  },
  methods: {
    ...mapActions(useRootStore, ["fetchDetailProducts"]),
  },
  created() {
    this.fetchDetailProducts(this.$route.params.id);
  },
};
</script>

<style lang="scss" scoped></style>
