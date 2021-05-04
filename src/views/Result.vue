<template>
  <div class="AnalysisId">Analysis Id : {{analysisId}}</div>
</template>
<script>
export default {
  name: 'Result',
  data() {
    return { analysisId: '' };
  },
};
</script>
<style scoped>
.AnalysisId{
  height: 400px;
}

</style>
