<template>
  <v-container fluid class="page-guide">
    <v-row justify="center">
      <v-col cols="12" lg="11" xl="10">
        <section class="page-guide-panel">
          <div class="page-guide-copy">
            <div class="page-guide-kicker">Page guide</div>
            <h6>{{ description }}</h6>
            <div class="page-guide-title">Quick steps</div>
          </div>
          <ol class="page-guide-steps">
            <li v-for="(step, index) in steps" :key="index">
              <span class="step-number">{{ index + 1 }}</span>
              <span class="step-text">{{ step }}</span>
            </li>
          </ol>
        </section>
      </v-col>
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
  margin-bottom: 18px;
  margin-top: 12px;
  padding-bottom: 0;
  padding-top: 0;
}

.page-guide-panel {
  align-items: flex-start;
  background: linear-gradient(135deg, #f8fbfa 0%, #ffffff 62%);
  border: 1px solid #d8ece8;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(24, 65, 59, 0.08);
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(280px, 0.95fr) minmax(420px, 1.45fr);
  padding: 16px 20px 16px 24px;
  position: relative;
}

.page-guide-panel::before {
  background: #009688;
  border-radius: 8px 0 0 8px;
  bottom: 0;
  content: "";
  left: 0;
  position: absolute;
  top: 0;
  width: 5px;
}

.page-guide-kicker {
  color: #00796b;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.page-guide h6 {
  color: #21312e;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.32;
  margin: 0;
}

.page-guide-title {
  color: #00796b;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-top: 10px;
  text-transform: uppercase;
}

.page-guide-steps {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.page-guide-steps li {
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid #e4efed;
  border-radius: 8px;
  display: flex;
  gap: 9px;
  line-height: 1.32;
  padding: 8px 10px;
}

.step-number {
  align-items: center;
  background: #e0f2ef;
  border: 1px solid #b8ded8;
  border-radius: 50%;
  color: #00796b;
  display: inline-flex;
  flex: 0 0 24px;
  font-size: 0.78rem;
  font-weight: 700;
  height: 24px;
  justify-content: center;
  margin-top: 0;
  width: 24px;
}

.step-text {
  color: #2b3432;
  display: block;
  font-size: 0.9rem;
}

@media (max-width: 960px) {
  .page-guide-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-guide-panel {
    gap: 12px;
    padding: 14px 14px 14px 18px;
  }

  .page-guide h6 {
    font-size: 0.98rem;
  }

  .page-guide-steps {
    grid-template-columns: 1fr;
  }

  .page-guide-steps li {
    padding: 8px;
  }
}
</style>
