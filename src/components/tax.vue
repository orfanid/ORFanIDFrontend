<template>
    <div></div>
</template>

<script>
export default {
    components: {

    },
    setup() {
        const { loadAssets } = taxAPI();
        const { searchAssets } = Search();
        const { searchAssets } = TaxCalculasations();
    }
}
</script>

<style>

</style>