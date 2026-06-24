<template>
  <v-container class="page-guide">
    <v-row>
      <v-spacer />
      <v-col cols="12" md="10">
        <h6>{{ description }}</h6>
        <div class="page-guide-title">To use this page, follow these steps:</div>
        <ol>
          <li v-for="(step, index) in steps" :key="index">{{ step }}</li>
        </ol>
      </v-col>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PageGuide",
  props: {
    description: {
      type: String,
      required: true
    },
    steps: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.page-guide {
  margin-bottom: 16px;
}

.page-guide-title {
  margin-top: 8px;
  margin-bottom: 4px;
}
</style>
