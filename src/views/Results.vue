<template>
 <div class="container">
   <div class="section">
        <div id="savedResultView" class="row">
            <div class="col s10 offset-s1 center-align">

                <table id="ResultViewTable" class="display" width="100%" cellspacing="0">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Analysis ID</th>
                        <th>E Mail</th>
                        <th>Organism</th>
                        <th>Genes</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tfoot>
                    <tr>
                        <th>Date</th>
                        <th>Analysis ID</th>
                        <th>E Mail</th>
                        <th>Organism</th>
                        <th>Genes</th>
                        <th></th>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>
</template>

<script >
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: { },
})
export default class Results extends Vue {}
</script>
